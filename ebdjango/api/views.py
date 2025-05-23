from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser, AppointmentSlot
from .serializers import AppointmentSlotSerializer
import boto3
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from rest_framework import status
from .aws_rekognition import index_face, search_face 
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from api.models import CustomUser
import json
from decimal import Decimal

stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

BUCKET_NAME = 'primetechusersloginfaces'

@api_view(['POST'])
def register(request):
    """
    Register a new user using facial recognition.

    Required fields:
    - username: User's unique username
    - password: User's password
    - image_filename: Image filename stored in S3 under 'toindex/'

    Returns:
    - Success message with face_id and S3 path
    - Error message if validation fails
    """
    
    username = request.data.get('username')
    password = request.data.get('password')
    image_filename = request.data.get('image_filename') 
    
    if not all([username, password, image_filename]):
        return Response(
            {'error': 'username, password and image_filename are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        if CustomUser.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username is already registered.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        image_key = f"toindex/{image_filename}"

        if CustomUser.objects.filter(s3_image_key=image_key).exists():
            return Response(
                {'error': 'Face is already registered.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = index_face(BUCKET_NAME, image_key)
        
        if not result.get('FaceRecords'):
            return Response(
                {'error': 'No face detected in the image'},
                status=status.HTTP_400_BAD_REQUEST
            )

        face_id = result['FaceRecords'][0]['Face']['FaceId']
        
        user = CustomUser.objects.create_user(
            username=username,
            password=password,
            face_id=face_id,
            s3_image_key=image_key
        )

        return Response({
            'message': 'Registration successful.',
            'face_id': face_id,
            's3_path': f"s3://{BUCKET_NAME}/{image_key}"
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
def loginWithCredentials(request):
    """
    Login using username and password.

    Required fields:
    - username: User's username
    - password: User's password

    Returns:
    - Access and refresh tokens on success
    - Error message on failure
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not all([username, password]):
        return Response(
            {'error': 'username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Login successful',
            'user_id': user.id,
            'username': user.username,
            'access_token': tokens['access'],
            'refresh_token': tokens['refresh']
        })
    else:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
def login(request):
    """
    Login using facial recognition only.

    Required fields:
    - image_filename: Image filename stored in S3 under 'todetect/'

    Returns:
    - Access token and user info on success
    - Error message on failure
    """
    image_filename = request.data.get('image_filename')

    if not image_filename:
        return Response(
            {'error': '"image_filename" is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        image_key = f"todetect/{image_filename}"

        result = search_face(BUCKET_NAME, image_key)

        face_matches = result.get('FaceMatches')
        if not face_matches:
            return Response(
                {'error': 'Face not recognized.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        face_match = face_matches[0]
        if face_match['Similarity'] < 90:
            return Response(
                {'error': 'Facial similarity is too low.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        face_id = face_match['Face']['FaceId']

        try:
            user = CustomUser.objects.get(face_id=face_id)
            tokens = get_tokens_for_user(user)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'User not found for the given face.'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            'message': 'Login successful.',
            'user_id': user.id,
            'access_token': tokens['access'],
            'username': user.username,
            'similarity': face_match['Similarity']
        })

    except Exception as e:
        return Response(
            {'error': f'Internal error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

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
def submit_repair(request):
    """
    Submit a repair request and start a StepFunctions workflow.

    Required fields in JSON body:
    - device, service_type, description, customer_id, appointment_date, initial_cost

    Returns:
    - StepFunctions execution ARN
    - Error if appointment is unavailable or workflow fails
    """
    body = json.loads(request.body)
    device = body['device']
    service_type = body['service_type']
    description = body['description']
    customer_id = body['customer_id']
    appointment_date = body['appointment_date']
    initial_cost = body['initial_cost']

    try:
        slot = AppointmentSlot.objects.get(start_time=appointment_date, is_booked=False)
    except AppointmentSlot.DoesNotExist:
        return JsonResponse({'error': 'Selected appointment slot is no longer available.'}, status=400)

    slot.is_booked = True
    slot.save()

    try:
        response = stepfunctions.start_execution(
            stateMachineArn='arn:aws:states:us-east-1:995136952401:stateMachine:RepairWorkflow',
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
        slot.is_booked = False
        slot.save()
        return JsonResponse({'error': str(e)}, status=500)
    
@api_view(['GET'])
def get_repairs(request):
    """
    Retrieve all repair requests or filter by customer ID.

    Query Parameters:
    - customer_id (optional): Filter by customer ID

    Returns:
    - List of repair objects
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
def pay(request, repair_id):
    """
    Process payment for a repair.

    Path parameter:
    - repair_id: ID of the repair

    Returns:
    - Payment confirmation or error if already paid or not found
    """
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
    Admin: Update the additional cost of a repair by adding to the current value.

    Returns a message confirming the update along with the updated additional cost.
    """
    repairs_table = dynamodb.Table('RepairRequests')
    try:
        body = json.loads(request.body)
        additional_cost_to_add = body['aditional_cost']
        
        get_response = repairs_table.get_item(
            Key={'repair_id': repair_id}
        )
        
        if 'Item' not in get_response:
            return Response({'error': 'Repair not found'}, status=404)
            
        item = get_response.get('Item', {})
        current_cost = item.get('aditional_cost')
        
        new_total = Decimal(str(current_cost)) + Decimal(str(additional_cost_to_add))
        
        update_response = repairs_table.update_item(
            Key={
                'repair_id': repair_id
            },
            UpdateExpression='SET aditional_cost = :val1',
            ExpressionAttributeValues={
                ':val1': new_total
            },
            ReturnValues="UPDATED_NEW" 
        )
        
        updated_value = update_response.get('Attributes', {}).get('aditional_cost', new_total)
        
        return Response({
            'message': 'Additional cost updated successfully.',
            'new_aditional_cost': updated_value
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['GET'])
def get_available_slots(request):
    """
    Retrieve all available appointment slots for a given year and month.
    """
    year = request.query_params.get('year')
    month = request.query_params.get('month')

    if not year or not month:
        return Response({"error": "year and month are required query parameters."},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        year = int(year)
        month = int(month)
    except ValueError:
        return Response({"error": "year and month must be integers."},
                        status=status.HTTP_400_BAD_REQUEST)

    slots = AppointmentSlot.objects.filter(
        start_time__year=year,
        start_time__month=month,
        is_booked=False
    ).order_by('start_time')

    serializer = AppointmentSlotSerializer(slots, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_repair_by_id(request, repair_id):
    """
    Retrieve a single repair request by its repair_id from DynamoDB,
    excluding customer_id and returning fields in a specific order.
    """
    repairs_table = dynamodb.Table('RepairRequests')

    try:
        response = repairs_table.get_item(Key={'repair_id': repair_id})
        item = response.get('Item')

        if not item:
            return Response({'error': 'Repair not found'}, status=404)

        ordered_item = {
            "repair_id": item.get("repair_id"),
            "status": item.get("status"),
            "device": item.get("device"),
            "service_type": item.get("service_type"),
            "description": item.get("description"),
            "initial_cost": item.get("initial_cost"),
            "aditional_cost": item.get("aditional_cost"),
            "appointment_date": item.get("appointment_date"),
            "customer_showed_up": item.get("customer_showed_up"),
            "paid": item.get("paid"),
            "picked_up": item.get("picked_up"),
        }

        return Response({'repair': ordered_item})

    except Exception as e:
        return Response({'error': str(e)}, status=500)
