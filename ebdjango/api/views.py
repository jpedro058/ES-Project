from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser
import boto3
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from .aws_rekognition import index_face, search_face, create_collection
import json
import jwt

stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')

@api_view(['POST'])
def register_view(request):
    imagem = request.FILES.get('image')
    if not imagem:
        return Response({'error': 'Image is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    face_id = index_face(imagem.read())
    if not face_id:
        return Response({'error': 'Face not detected.'}, status=status.HTTP_400_BAD_REQUEST)
    
    data = request.data.copy()
    data['face_id'] = face_id
    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(data['password'])
        user.save()
        return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    imagem = request.FILES.get('image')
    if not imagem:
        return Response({'error': 'Image is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    face_id = search_face(imagem.read())
    if not face_id:
        return Response({'error': 'Face not recognized.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        user = CustomUser.objects.get(face_id=face_id)
        return Response({
            'message': 'Welcome back, {user.username}'})
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

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
