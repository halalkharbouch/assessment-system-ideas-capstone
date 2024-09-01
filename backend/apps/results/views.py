from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Result
from rest_framework.response import Response
from rest_framework import generics
from apps.users.models import Student
from .serializer import ResultSerializer
from rest_framework import viewsets


class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer

    def perform_create(self, serializer):
        serializer.save()  # 

# Create your views here.
class DeleteResultView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        result = Result.objects.get(pk=pk)
        result.delete()
        return Response({"message": "Result deleted successfully"})
    

class UserResultsView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        student = Student.objects.get(user=user)
        return student.results.all()
    
class ResultDetailView(generics.RetrieveAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Override get_object to fetch the Result instance based on the ID from the URL.
        """
        user = self.request.user
        student = Student.objects.get(user=user)
        # Get the Result instance for the student with the specified ID
        result_id = self.kwargs.get('pk')
        return Result.objects.get(student=student, id=result_id)