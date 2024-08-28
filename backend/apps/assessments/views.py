from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Assessment
from datetime import timedelta
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import AssessmentSerializer
from apps.users.models import Teacher
from apps.courses.models import Course
from apps.modules.models import Module
from apps.users.models import User, Student, Teacher
from apps.users.serializers import StudentSerializer, TeacherSerializer, UserSerializer

class AssessmentListView(generics.ListAPIView):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]


class CreateAssessmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Extract data from request
        module_id = request.data.get('module')
        course_id = request.data.get('course')
        module_is_new = request.data.get('module_is_new', False)

        # Fetch the teacher associated with the current user
        teacher = self.get_teacher(request.user)
        if teacher is None:
            return Response({"error": "Teacher not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the course
        course = self.get_course(course_id)
        if course is None:
            return Response({"error": f"Course with ID {course_id} does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch or create the module
        module = self.get_or_create_module(request, module_id, course, module_is_new)
        if isinstance(module, Response):
            return module  # This is an error response

        # Handle time limit
        time_limit = self.parse_time_limit(request.data.get('time_limit'))
        if isinstance(time_limit, Response):
            return time_limit  # This is an error response

        # Create the assessment
        assessment = Assessment(
            name=request.data.get('name'),
            description=request.data.get('description'),
            time_limit=time_limit,
            total_marks=request.data.get('total_marks'),
            passing_marks=request.data.get('passing_marks'),
            start_date=request.data.get('start_date'),
            end_date=request.data.get('end_date'),
            is_published=request.data.get('is_published', False),
            created_by=teacher,
            course=course,
            module=module
        )
        assessment.save()

        # Serialize and return the created assessment
        serializer = AssessmentSerializer(assessment)

        # Prepare user data based on user type
        user = request.user
        if user.user_type == 'student':  # Check if user is a student
            try:
                student = Student.objects.get(user=request.user)
                user_data = StudentSerializer(student).data
            except Student.DoesNotExist:
                return Response({"error": "No associated student record found."}, status=status.HTTP_400_BAD_REQUEST)
        elif user.user_type == 'teacher' or user.is_superuser:  # Check if user is a teacher
            try:
                teacher = Teacher.objects.get(user=request.user)
                user_data = TeacherSerializer(teacher).data
            except Teacher.DoesNotExist:
                return Response({"error": "No associated teacher record found."}, status=status.HTTP_400_BAD_REQUEST)
        else:  # Handle other user types or superuser
            user_data = UserSerializer(request.user).data

        return Response({"message": "Assessment created successfully", "data": serializer.data, "user": user_data}, status=status.HTTP_201_CREATED)

    def get_teacher(self, user):
        try:
            return Teacher.objects.get(user=user)
        except Teacher.DoesNotExist:
            return None

    def get_course(self, course_id):
        try:
            return Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return None

    def get_or_create_module(self, request, module_id, course, module_is_new):
        if module_is_new:
            return Module.objects.create(name=request.data.get('module'), course=course)
        else:
            try:
                return Module.objects.get(id=module_id, course=course)
            except Module.DoesNotExist:
                return Response({"error": f"Module with ID {module_id} does not exist."}, status=status.HTTP_400_BAD_REQUEST)

    def parse_time_limit(self, time_limit):
        if isinstance(time_limit, int):
            return timedelta(seconds=time_limit)
        elif isinstance(time_limit, str):
            try:
                hours, minutes, seconds = map(int, time_limit.split(':'))
                return timedelta(hours=hours, minutes=minutes, seconds=seconds)
            except ValueError:
                return Response({"error": "Invalid time format for time_limit. Use 'HH:MM:SS'."}, status=status.HTTP_400_BAD_REQUEST)
        return None


class UpdateAssessmentView(generics.UpdateAPIView):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated]


class DeleteAssessmentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        # Fetch the assessment to be deleted
        try:
            assessment = Assessment.objects.get(id=pk)
        except Assessment.DoesNotExist:
            return Response({"error": "Assessment not found."}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the teacher associated with the current user
        teacher = self.get_teacher(request.user)
        if teacher is None:
            return Response({"error": "Teacher not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the assessment belongs to the teacher
        if assessment.created_by != teacher:
            return Response({"error": "You do not have permission to delete this assessment."}, status=status.HTTP_403_FORBIDDEN)

        # Delete the assessment
        assessment.delete()

        # Prepare user data based on user type
        user = request.user
        if user.user_type == 'student':  # Check if user is a student
            try:
                student = Student.objects.get(user=request.user)
                user_data = StudentSerializer(student).data
            except Student.DoesNotExist:
                return Response({"error": "No associated student record found."}, status=status.HTTP_400_BAD_REQUEST)
        elif user.user_type == 'teacher' or user.is_superuser:  # Check if user is a teacher
            try:
                teacher = Teacher.objects.get(user=request.user)
                user_data = TeacherSerializer(teacher).data
            except Teacher.DoesNotExist:
                return Response({"error": "No associated teacher record found."}, status=status.HTTP_400_BAD_REQUEST)
        else:  # Handle other user types or superuser
            user_data = UserSerializer(request.user).data

        return Response({"message": "Assessment deleted successfully", "user": user_data}, status=status.HTTP_200_OK)

    def get_teacher(self, user):
        try:
            return Teacher.objects.get(user=user)
        except Teacher.DoesNotExist:
            return None

class AssessmentDetailView(generics.RetrieveAPIView):
    queryset = Assessment.objects.all()
    lookup_field = 'pk'
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

class UpdateAssessmentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        # Fetch the assessment to be updated
        try:
            assessment = Assessment.objects.get(id=pk)
        except Assessment.DoesNotExist:
            return Response({"error": "Assessment not found."}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the teacher associated with the current user
        teacher = self.get_teacher(request.user)
        if teacher is None:
            return Response({"error": "Teacher not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the assessment belongs to the teacher
        if assessment.created_by != teacher:
            return Response({"error": "You do not have permission to update this assessment."}, status=status.HTTP_403_FORBIDDEN)

        # Update the assessment's publish status
        is_published = request.data.get('is_published')
        if is_published is not None:
            assessment.is_published = is_published
            assessment.save()
        else:
            return Response({"error": "No publish status provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize the updated assessment
        serializer = AssessmentSerializer(assessment)

        # Prepare user data based on user type
        user = request.user
        if user.user_type == 'student':  # Check if user is a student
            try:
                student = Student.objects.get(user=request.user)
                user_data = StudentSerializer(student).data
            except Student.DoesNotExist:
                return Response({"error": "No associated student record found."}, status=status.HTTP_400_BAD_REQUEST)
        elif user.user_type == 'teacher' or user.is_superuser:  # Check if user is a teacher
            try:
                teacher = Teacher.objects.get(user=request.user)
                user_data = TeacherSerializer(teacher).data
            except Teacher.DoesNotExist:
                return Response({"error": "No associated teacher record found."}, status=status.HTTP_400_BAD_REQUEST)
        else:  # Handle other user types or superuser
            user_data = UserSerializer(request.user).data

        return Response({"message": "Assessment status updated successfully", "data": serializer.data, "user": user_data}, status=status.HTTP_200_OK)

    def get_teacher(self, user):
        try:
            return Teacher.objects.get(user=user)
        except Teacher.DoesNotExist:
            return None

