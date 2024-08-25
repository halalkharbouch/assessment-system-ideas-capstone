from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers import SuperuserSerializer
from ..models import User

class CreateSuperuserView(generics.CreateAPIView):
    serializer_class = SuperuserSerializer


class ListSuperusersView(generics.ListAPIView):
    queryset = User.objects.filter(is_superuser=True)
    serializer_class = SuperuserSerializer

class UpdateSuperuserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = SuperuserSerializer
    lookup_field = 'pk'

class DeleteSuperuserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    lookup_field = 'pk'

class SuperuserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = SuperuserSerializer
    lookup_field = 'pk'