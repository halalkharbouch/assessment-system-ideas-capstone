from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers import TeacherSerializer
from ..models import Teacher

class CreateTeacherView(generics.CreateAPIView):
    serializer_class = TeacherSerializer


class ListTeachersView(generics.ListAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
