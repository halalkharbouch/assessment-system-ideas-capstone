from django.shortcuts import render
from rest_framework import generics
from .models import Module
from .serializer import ModuleSerializer
from django_backend.permissions import IsStaffUser, IsSuperuser
from rest_framework.permissions import AllowAny, IsAuthenticated

class ModuleListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

class ModuleDetailView(generics.RetrieveAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

class ModuleCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

class ModuleDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    queryset = Module.objects.all()

class ModuleUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer