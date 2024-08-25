from rest_framework import generics, status
from rest_framework.response import Response
from .models import Course
from .serializer import CourseSerializer

class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CreateCourseView(generics.CreateAPIView):
    serializer_class = CourseSerializer

class UpdateCourseView(generics.UpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'pk'

class DeleteCourseView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    lookup_field = 'pk'

class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    lookup_field = 'pk'