from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser
import boto3
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from rest_framework import status
from .aws_rekognition import index_face, search_face 
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
import json

stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

BUCKET_NAME = 'primetechusersloginfaces'

@api_view(['POST'])
def register(request):
    
    username = request.data.get('username')
    password = request.data.get('password')
    image_filename = request.data.get('image_filename') 
    
    if not all([username, password, image_filename]):
        return Response(
            {'error': 'username, password e image_filename são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Verifica se usuário já existe
        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username já registrado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Caminho completo no S3
        image_key = f"toindex/{image_filename}"
        
        # Indexa o rosto
        result = index_face(BUCKET_NAME, image_key)
        
        if not result.get('FaceRecords'):
            return Response(
                {'error': 'Nenhum rosto detectado na imagem'},
                status=status.HTTP_400_BAD_REQUEST
            )

        face_id = result['FaceRecords'][0]['Face']['FaceId']
        
        # Cria o usuário
        user = CustomUser.objects.create(
            username=username,
            password=password,
            face_id=face_id,
            s3_image_key=image_key
        )

        return Response({
            'message': 'Registro bem-sucedido',
            'face_id': face_id,
            's3_path': f"s3://{BUCKET_NAME}/{image_key}"
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def login(request):
    """
    Endpoint for user login with facial recognition.
    
    Returns a message confirming successful login.
    """
    image_filename = request.data.get('image_filename')  # Ex: "login_attempt.jpg"
    
    if not image_filename:
        return Response(
            {'error': 'image_filename é obrigatório'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Caminho completo no S3
        image_key = f"todetect/{image_filename}"
        
        # Busca o rosto
        result = search_face(BUCKET_NAME, image_key)
        
        if not result.get('FaceMatches'):
            return Response(
                {'error': 'Rosto não reconhecido'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        face_match = result['FaceMatches'][0]
        if face_match['Similarity'] < 90:  # Limiar de confiança
            return Response(
                {'error': 'Similaridade facial insuficiente'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        face_id = face_match['Face']['FaceId']
        user = CustomUser.objects.get(face_id=face_id)

        return Response({
            'message': 'Login bem-sucedido',
            'user_id': user.id,
            'username': user.username,
            'similarity': face_match['Similarity']
        })

    except CustomUser.DoesNotExist:
        return Response(
            {'error': 'Usuário não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
      
@api_view(['POST'])
def logout_view(request):
    """
    Endpoint for user logout.
    
    Returns a message confirming successful logout.
    """
    return Response({'message': 'Logout successful.'})


@api_view(['GET'])
def shop_info(request):
    """
    Home page for the repair shop.
    
    Returns shop information including name and available services with titles and descriptions.
    """
    services = [
        {
            "title": "Screen Replacement",
            "type": "screen-replacement",
            "desc": "Is your device's screen broken, scratched or unresponsive to touch? Our specialized team will replace it with high-quality parts, guaranteeing the integrity and original sensitivity of the screen. Fast and guaranteed service.",
        },
        {
            "title": "Battery Replacement",
            "type": "battery-replacement",
            "desc": "Do you notice that your device discharges quickly or shuts down unexpectedly? We'll replace the battery with a new one, with guaranteed performance and certified compatibility, so you can once again rely on your device's autonomy.",
        },
        {
            "title": "Software Issues",
            "type": "software-issues",
            "desc": "Is your computer slow, does it constantly show errors or doesn't boot up properly? We carry out a complete analysis of the operating system and installed software, resolve conflicts, optimize performance and guarantee smooth and safe use.",
        },
        {
            "title": "Virus Removal",
            "type": "virus-removal",
            "desc": "Have you detected strange behavior, pop-ups or suspicious files on your system? We use advanced tools to remove viruses, malware and spyware, restoring security and stability to your device without compromising your data.",
        },
    ]
    
    return Response({
        'shop': 'PrimeTech Repairs',
        'about': 'We are a specialized tech repair shop offering high-quality repair services for all your devices.',
        'services': services
    })

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def submit_repair(request):
    """
    Submit a new repair request.

    Initiates a StepFunctions workflow for repair processing.
    """
    body = json.loads(request.body)
    device = body['device']
    service_type = body['service_type']
    description = body['description']
    customer_id = body['customer_id']  # This should be the logged-in user's ID
    appointment_date = body['appointment_date']
    initial_cost = body['initial_cost']

    try:
        response = stepfunctions.start_execution(
            stateMachineArn='arn:aws:states:us-east-1:995136952401:stateMachine:RepairWorkflow', # mudar para o vosso ARN
            input=json.dumps({
                'device': device,
                'service_type': service_type,
                'description': description,
                'customer_id': customer_id,
                'appointment_date': appointment_date,
                'initial_cost': initial_cost
            })
        )
        return JsonResponse({'executionArn': response['executionArn']})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_repairs(request):
    """
    Retrieve repair requests, optionally filtered by customer_id.
    
    Query parameters:
    - customer_id: Filter repairs by customer ID
    
    Returns a list of repair information including id, status, and device type.
    """
    customer_id = request.query_params.get('customer_id')
    repairs_table = dynamodb.Table('RepairRequests')
    
    try:
        if customer_id:
            # Filter if customer_id is provided
            response = repairs_table.scan(
                FilterExpression=boto3.dynamodb.conditions.Attr('customer_id').eq(str(customer_id))
            )
        else:
            # All repairs if no customer_id is provided
            response = repairs_table.scan()
            
        repairs = response['Items']
        
        repairs_info = [
            {
                'repair_id': repair.get('repair_id'),
                'status': repair.get('status'),
                'device': repair.get('device'),
                'service_type': repair.get('service_type'),
                'description': repair.get('description'),
                'initial_cost': repair.get('initial_cost'),
                'aditional_cost': repair.get('aditional_cost'),
                'appointment_date': repair.get('appointment_date'),
                'customer_showed_up': repair.get('customer_showed_up'),
                'paid': repair.get('paid'),
                'picked_up': repair.get('picked_up')
            }
            for repair in repairs
        ]
        
        return Response({'repairs': repairs_info})
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)
  
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def pay(request, repair_id):
    """
    Process payment for a repair.
    
    Returns a message confirming the payment status.
    """
    # TODO: Add authentication & user check
    repairs_table = dynamodb.Table('RepairRequests')

    try:
        response = repairs_table.get_item(Key={'repair_id': repair_id})
        item = response.get('Item')

        if not item:
            return Response({"error": "Repair not found"}, status=404)
        if item.get('paid'):
            return Response({"message": "Already paid"}, status=200)

        repairs_table.update_item(
            Key={'repair_id': repair_id},
            UpdateExpression="SET paid = :val",
            ExpressionAttributeValues={
                ':val': True,
                ':false': False
            },
            ConditionExpression="attribute_not_exists(paid) OR paid = :false"
        )

        return Response({"message": "Payment successful"}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PUT'])
def update_showed_up(request, repair_id):
    """
    Admin: Update the status of customer_showed_up to true.

    Returns a message confirming the update.
    """
    repairs_table = dynamodb.Table('RepairRequests')
    try:
        response = repairs_table.update_item(
            Key={
                'repair_id': repair_id
            },
            UpdateExpression='SET customer_showed_up = :val1',
            ExpressionAttributeValues={
                ':val1': True
            }
        )
        return Response({'message': 'Customer showed up status updated successfully.'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['PUT'])
def update_picked_up(request, repair_id):
    """
    Admin: Update the status of picked_up to true.

    Returns a message confirming the update.
    """
    repairs_table = dynamodb.Table('RepairRequests')
    try:
        response = repairs_table.update_item(
            Key={
                'repair_id': repair_id
            },
            UpdateExpression='SET picked_up = :val1',
            ExpressionAttributeValues={
                ':val1': True
            }
        )
        return Response({'message': 'Repair picked up status updated successfully.'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['PUT'])
def update_aditional_cost(request, repair_id):
    """
    Admin: Update the additional cost of a repair.

    Returns a message confirming the update.
    """
    repairs_table = dynamodb.Table('RepairRequests')
    try:
        body = json.loads(request.body)
        additional_cost = body['additional_cost']
        
        response = repairs_table.update_item(
            Key={
                'repair_id': repair_id
            },
            UpdateExpression='SET additional_cost = :val1',
            ExpressionAttributeValues={
                ':val1': additional_cost
            }
        )
        return Response({'message': 'Additional cost updated successfully.'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
