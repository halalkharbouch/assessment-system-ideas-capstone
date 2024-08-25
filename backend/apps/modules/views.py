from django.shortcuts import render
from rest_framework import generics
from .models import Module
from .serializer import ModuleSerializer

class ModuleListView(generics.ListAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

class ModuleDetailView(generics.RetrieveAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

class ModuleCreateView(generics.CreateAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer

class ModuleDeleteView(generics.DestroyAPIView):
    queryset = Module.objects.all()

class ModuleUpdateView(generics.UpdateAPIView):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer