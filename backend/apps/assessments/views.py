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
from apps.results.models import Result
from django.shortcuts import get_object_or_404
from apps.choices.models import Choice
from django_backend.permissions import IsStaffUser, IsSuperuser

class AssessmentListView(generics.ListAPIView):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]


class AssessmentsByModuleView(generics.ListAPIView):
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        module_id = self.request.query_params.get('module_id')
        return Assessment.objects.filter(module_id=module_id)


class CurrentUserAssessmentsView(generics.ListAPIView):
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        teacher = Teacher.objects.get(user=user)
        return Assessment.objects.filter(created_by=teacher)

class CreateAssessmentView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

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



        return Response({"message": "Assessment created successfully", "assessment": serializer.data}, status=status.HTTP_201_CREATED)

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
            return timedelta(minutes=time_limit)
        elif isinstance(time_limit, str):
            try:
                return timedelta(minutes=int(time_limit))
            except ValueError:
                return Response({"error": "Invalid time format for time_limit. Use 'HH:MM:SS'."}, status=status.HTTP_400_BAD_REQUEST)
        return None


class UpdateAssessmentView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def put(self, request, pk):
        # Fetch the assessment to be updated
        try:
            assessment = Assessment.objects.get(id=pk)
        except Assessment.DoesNotExist:
            return Response({"error": "Assessment not found."}, status=status.HTTP_404_NOT_FOUND)


        # Fetch the teacher associated with the current user
        teacher = self.get_teacher(request.user)
        if teacher is None:
            return Response({"error": "Teacher not found."}, status=status.HTTP_400_BAD_REQUEST)

        # Handle time limit
        time_limit = self.parse_time_limit(request.data.get('time_limit'))
        if isinstance(time_limit, Response):
            return time_limit  # This is an error response

        # Update the assessment fields
        assessment.name = request.data.get('name', assessment.name)
        assessment.description = request.data.get('description', assessment.description)
        assessment.time_limit = time_limit or assessment.time_limit
        assessment.total_marks = request.data.get('total_marks', assessment.total_marks)
        assessment.passing_marks = request.data.get('passing_marks', assessment.passing_marks)
        assessment.start_date = request.data.get('start_date', assessment.start_date)
        assessment.end_date = request.data.get('end_date', assessment.end_date)

        # Save the updated assessment
        assessment.save()

        # Serialize and return the updated assessment
        serializer = AssessmentSerializer(assessment)
        return Response({"message": "Assessment updated successfully", "assessment": serializer.data}, status=status.HTTP_200_OK)
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
            return timedelta(minutes=time_limit)
        elif isinstance(time_limit, str):
            try:
                return timedelta(minutes=int(time_limit))
            except ValueError:
                return Response({"error": "Invalid time format for time_limit. Use 'HH:MM:SS'."}, status=status.HTTP_400_BAD_REQUEST)
        return None
    
class DeleteAssessmentView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    serializer_class = AssessmentSerializer
    queryset = Assessment.objects.all()



class AssessmentDetailView(generics.RetrieveAPIView):
    queryset = Assessment.objects.all()
    lookup_field = 'pk'
    serializer_class = AssessmentSerializer
    permission_classes = [IsAuthenticated]

class UpdateAssessmentStatusView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

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


        return Response({"message": "Assessment status updated successfully", "assessment": serializer.data}, status=status.HTTP_200_OK)

    def get_teacher(self, user):
        try:
            return Teacher.objects.get(user=user)
        except Teacher.DoesNotExist:
            return None

class SubmitAssessmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assessment_id):
        # Get the assessment
        assessment = get_object_or_404(Assessment, id=assessment_id)

        # Get the student (assuming the student is logged in and their ID is available in the request)
        student = Student.objects.get(user=request.user)

        # check if assessment is in student.completed_assessments
        if assessment in student.completed_assessments.all():
            return Response({"error": "You have already completed this assessment."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the submitted answers from the request
        submitted_answers = request.data.get('answers', {})

        print("Submitted answers:", submitted_answers)

        # Initialize the score
        score = 0
        incorrect_answers = {}

        # Iterate through each question in the assessment
        for question in assessment.questions.all():
            question_id = str(question.id)
            
            # Debugging: Print the question ID and submitted answer
            print(f"Question ID: {question_id}, Submitted Answer: {submitted_answers.get(question_id)}")

            if question_id in submitted_answers:
                submitted_answer = submitted_answers[question_id]

                if question.question_type == 'mcq':
                    # For MCQ, check if the selected choice is correct
                    try:
                        selected_choice = Choice.objects.get(
                            id=submitted_answer, question=question
                        )
                        if selected_choice.is_correct:
                            score += question.marks
                        else:
                            incorrect_answers[question_id] = selected_choice.id
                    except Choice.DoesNotExist:
                        incorrect_answers[question_id] = submitted_answer

                elif question.question_type == 'trueFalse':
                    # For True/False, compare the submitted answer with the actual answer
                    if (submitted_answer == 'True' and question.is_true) or (
                        submitted_answer == 'False' and not question.is_true
                    ):
                        score += question.marks

        # Save the result
        result = Result.objects.create(student=student, assessment=assessment, score=score, incorrect_answers=incorrect_answers)
        user = request.user
        student = Student.objects.get(user=user)
        student.results.add(result)
        student.completed_assessments.add(assessment)
        assessment.results.add(result)
        # Return the calculated score and other relevant information
        return Response(
            {
                "message": "Assessment submitted successfully",
                "score": score,
                "total_marks": assessment.total_marks,
                "passing_marks": assessment.passing_marks,
                "incorrect_answers": incorrect_answers,
            },
            status=status.HTTP_200_OK,
        )





