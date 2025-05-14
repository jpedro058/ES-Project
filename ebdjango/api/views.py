from rest_framework.decorators import api_view
from rest_framework.response import Response
import boto3
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
import json

stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')

@api_view(['POST'])
def login_view(request):
    """
    Endpoint for user login with facial recognition.
    
    Returns a message confirming successful login.
    """
    return Response({'message': 'Login successful (simulated facial recognition).'})

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
    Retrieve information about the repair shop.
    
    Returns shop name and available services.
    """
    return Response({'shop': 'PrimeTech Repairs', 'services': ['Screen repair', 'Battery replacement']})

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def submit_repair(request):
    """
    Submit a new repair request.
    
    {
        "device": "Phone",
        "service_type": "Screen Replacement",
        "description": "Broken screen",
        "appointment_date": "2025-05-14T15:00:00",
        "customer_name": "Anibal", (provided automatically as the user is logged in)
        "customer_email": "anibal@gmail.com" (provided automatically as the user is logged in)
    }

    Initiates a StepFunctions workflow for repair processing.
    """
    body = json.loads(request.body)
    customer_id = body['customer_id']
    appointment_time = body['appointment_time']

    try:
        response = stepfunctions.start_execution(
            stateMachineArn='arn:aws:states:us-east-1:995136952401:stateMachine:RepairWorkflow', # mudar para o vosso ARN
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
    """
    Process payment for a repair.
    
    Returns a message confirming successful payment processing.
    """
    return Response({'message': 'Payment processed.'})

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def repair_status(request, repair_id):
    """
    Get the current status of a repair by repair_id.
    
    Returns the repair ID and current status.
    """
    return Response({'repair_id': repair_id, 'status': 'Waiting for payment'})
