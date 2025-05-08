from rest_framework.decorators import api_view
from rest_framework.response import Response

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
    return Response({'message': 'Repair request submitted.'})

@api_view(['POST'])
def pay(request):
    return Response({'message': 'Payment processed.'})

@api_view(['GET'])
def repair_status(request, repair_id):
    return Response({'repair_id': repair_id, 'status': 'Waiting for payment'})
