from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser
import boto3
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from rest_framework import status
from .aws_rekognition import index_face, search_face 
import json

stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')

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
    return Response({'message': 'Logout successful.'})

@api_view(['GET'])
def shop_info(request):
    return Response({'shop': 'PrimeTech Repairs', 'services': ['Screen repair', 'Battery replacement']})

@api_view(['POST'])
def submit_repair(request):
    body = json.loads(request.body)
    customer_id = body['customer_id']
    appointment_time = body['appointment_time']

    try:
        response = stepfunctions.start_execution(
            stateMachineArn='arn:aws:states:us-east-1:995136952401:stateMachine:RepairWorkflow', # mudar account id para o vosso
            input=json.dumps({
                'customer_id': customer_id,
                'appointment_time': appointment_time
            })
        )
        return JsonResponse({'executionArn': response['executionArn']})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
def pay(request):
    return Response({'message': 'Payment processed.'})

@api_view(['GET'])
def repair_status(request, repair_id):
    return Response({'repair_id': repair_id, 'status': 'Waiting for payment'})
