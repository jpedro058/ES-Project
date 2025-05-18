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

