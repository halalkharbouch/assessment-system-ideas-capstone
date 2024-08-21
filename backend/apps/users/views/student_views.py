from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers import StudentSerializer
from ..models import Student

class CreateStudentView(generics.CreateAPIView):
    serializer_class = StudentSerializer

class ListStudentView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

