from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser
import boto3
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from .aws_rekognition import index_face, search_face, create_collection 
from django.conf import settings
import json
import jwt

stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')

create_collection()

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    image_key = 'toindex/andy_portrait_resized.jpg'

    try:
        user = CustomUser.objects.get(username=username)
        result = index_face('primetechusersloginfaces', image_key)
        face_id = result['FaceRecords'][0]['Face']['FaceId']
        user.face_id = face_id
        user.s3_image_key = image_key
        user.save()

        return Response({'message': 'Face registered successfully.'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    image_key = 'todetect/tentativa1.jpg'

    try:
        result = search_face('primetechusersloginfaces', image_key)
        if len(result['FaceMatches']) == 0:
            return Response({'error': 'Face not recognized'}, status=401)

        face_id = result['FaceMatches'][0]['Face']['FaceId']
        user = CustomUser.objects.get(face_id=face_id)

        return Response({'message': 'Login successful', 'username': user.username})
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
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
