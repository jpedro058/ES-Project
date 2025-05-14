from rest_framework.decorators import api_view
from rest_framework.response import Response
import boto3
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
import json

stepfunctions = boto3.client('stepfunctions', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

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
        "customer_id": "12345"
    }

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
    
    Returns a list of repair request IDs.
    """
    customer_id = request.query_params.get('customer_id')
    repairs_table = dynamodb.Table('RepairRequests')
    
    try:
        if customer_id:
            # Use scan with a filter expression if customer_id is provided
            response = repairs_table.scan(
                FilterExpression=boto3.dynamodb.conditions.Attr('customer_id').eq(str(customer_id))
            )
        else:
            # Return all repairs if no customer_id is provided
            response = repairs_table.scan()
            
        repairs = response['Items']
        
        # Extract just the repair_ids from the items
        repair_ids = [repair.get('repair_id') for repair in repairs]
        
        return Response({'repair_ids': repair_ids})
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def repair_status(request, repair_id):
    """
    Get the current status of a repair by repair_id.
    
    Returns the current status of the repair along with its information.
    """
    try:
        repairs_table = dynamodb.Table('RepairRequests')
        response = repairs_table.get_item(
            Key={
                'repair_id': repair_id
            }
        )
        
        if 'Item' not in response:
            return Response({
                'status': 'error',
                'message': 'Repair not found'
            }, status=404)
            
        repair = response['Item']
        
        return Response({
            'repair_status': repair.get('status'),
            'device': repair.get('device'),
            'service_type': repair.get('service_type'),
            'description': repair.get('description'),
            'initial_cost': repair.get('initial_cost'),
            'additional_cost': repair.get('additional_cost')
        })
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=500)
    
@api_view(['POST'])
def pay(request):
    """
    Process payment for a repair.
    
    Returns a message confirming successful payment processing.
    """
    return Response({'message': 'Payment processed.'})
