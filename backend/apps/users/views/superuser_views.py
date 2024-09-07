from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers import SuperuserSerializer
from ..models import User
from rest_framework.permissions import IsAuthenticated
from django_backend.permissions import IsStaffUser, IsSuperuser

class CreateSuperuserView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser, IsSuperuser]
    serializer_class = SuperuserSerializer


class ListSuperusersView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser, IsSuperuser]
    queryset = User.objects.filter(is_superuser=True)
    serializer_class = SuperuserSerializer

class UpdateSuperuserView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser, IsSuperuser]
    queryset = User.objects.all()
    serializer_class = SuperuserSerializer
    lookup_field = 'pk'

class DeleteSuperuserView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser, IsSuperuser]
    queryset = User.objects.all()
    lookup_field = 'pk'

class SuperuserDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    queryset = User.objects.all()
    serializer_class = SuperuserSerializer
    lookup_field = 'pk'