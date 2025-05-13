from rest_framework.decorators import api_view
from rest_framework.response import Response
import boto3
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')

@api_view(['POST'])
def login_view(request):
    return Response({'message': 'Login successful (simulated facial recognition).'})

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
