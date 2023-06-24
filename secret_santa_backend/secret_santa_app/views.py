from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer


# Create your views here.
@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Registration successful!'})
    return Response(serializer.errors, status=400)