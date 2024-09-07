from rest_framework import generics, status
from rest_framework.response import Response
from .models import Course
from .serializer import CourseSerializer
from rest_framework.views import APIView
from apps.users.models import Student
from django_backend.permissions import IsStaffUser, IsSuperuser
from rest_framework.permissions import AllowAny, IsAuthenticated


class CourseListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CreateCourseView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    serializer_class = CourseSerializer

class UpdateCourseView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'pk'

class DeleteCourseView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    queryset = Course.objects.all()
    lookup_field = 'pk'

class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
    lookup_field = 'pk'

class StudentAssessmentListView(APIView):
    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            student = Student.objects.get(user=request.user)
            completed_assessments = student.completed_assessments.all()

            modules_data = []
            for module in course.modules.all():
                published_assessments = module.assessments.filter(is_published=True).exclude(id__in=completed_assessments)

                if published_assessments.exists():
                    module_data = {
                        "id": module.id,
                        "name": module.name,
                        "assessments": []
                    }
                    for assessment in published_assessments:
                        assessment_data = {
                            "id": assessment.id,
                            "name": assessment.name,
                            "description": assessment.description,
                            "start_date": assessment.start_date,
                            "end_date": assessment.end_date,
                            "time_limit": assessment.time_limit,
                            "total_marks": assessment.total_marks,
                            "passing_marks": assessment.passing_marks,
                            "questions": []
                        }
                        for question in assessment.questions.all():
                            question_data = {
                                "id": question.id,
                                "question_text": question.question_text,
                                "question_type": question.question_type,
                                "choices": []
                            }
                            for choice in question.choices.all():
                                choice_data = {
                                    "id": choice.id,
                                    "choice_text": choice.choice_text,
                                    # Omit is_correct field here
                                }
                                question_data["choices"].append(choice_data)
                            assessment_data["questions"].append(question_data)
                        module_data["assessments"].append(assessment_data)

                    modules_data.append(module_data)

            return Response({"id": course.id, "modules": modules_data, "name": course.name}, status=status.HTTP_200_OK)
        
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)