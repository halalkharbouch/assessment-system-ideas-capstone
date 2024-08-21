from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers import UserSerializer
from ..models import User

class ListUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
