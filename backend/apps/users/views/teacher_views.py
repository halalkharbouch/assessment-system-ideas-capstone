from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..serializers import TeacherSerializer, UserSerializer
from ..models import Teacher, User
from apps.courses.models import Course
from apps.modules.models import Module
import logging

# Set up logger
logger = logging.getLogger(__name__)

class CreateTeacherView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        # Directly get the data from the request
        user_data = request.data.get('user', {})
        courses_data = request.data.get('courses', [])
        modules_data = request.data.get('modules', {})

        # Create the user object
        user = User(
            first_name=user_data.get('first_name'),
            last_name=user_data.get('last_name'),
            email=user_data.get('email'),
            is_staff=True,
            is_active=True,
            is_superuser=True,
            user_type='teacher'
        )
        user.save()

        # Create the teacher object
        teacher = Teacher.objects.create(user=user)

        # Handle courses and associated modules
        for course_data in courses_data:
            course_id = course_data.get('id')
            course_name = course_data.get('name')
            is_new = course_data.get('is_new', False)

            if course_id and not is_new:
                # Fetch existing course by ID
                try:
                    course = Course.objects.get(id=course_id)
                except Course.DoesNotExist:
                    return Response(
                        {'courses': [f'Course with ID {course_id} does not exist.']}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                # Create a new course
                course, created = Course.objects.get_or_create(name=course_name)

            # Add the course to the teacher
            teacher.courses.add(course)

            # Handle associated modules for this course
            course_modules = modules_data.get(str(course_id), [])
            for module_data in course_modules:
                module_id = module_data.get('id')
                module_name = module_data.get('name')
                is_new = module_data.get('is_new', False)

                if module_id and not is_new:
                    try:
                        module = Module.objects.get(id=module_id)
                    except Module.DoesNotExist:
                        return Response(
                            {'modules': [f'Module with ID {module_id} does not exist.']}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    # Create or get new module
                    module, created = Module.objects.get_or_create(name=module_name, course=course)

                # Add the module to the teacher
                teacher.modules.add(module)

        # Serialize the teacher object
        serializer = TeacherSerializer(teacher)

        return Response({"message": "Teacher created successfully", "user": serializer.data}, status=status.HTTP_201_CREATED)



class ListTeachersView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

class UpdateTeacherView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        # Retrieve the teacher object
        try:
            teacher = Teacher.objects.get(id=pk)
        except Teacher.DoesNotExist:
            return Response(
                {'detail': 'Teacher not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        user_data = request.data.get('user', {})
        courses_data = request.data.get('courses', [])
        modules_data = request.data.get('modules', {})

        # Update user information
        user = teacher.user
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.email = user_data.get('email', user.email)
        user.save()

        # Update courses
        # Clear existing courses
        teacher.courses.clear()
        
        for course_data in courses_data:
            course_id = course_data.get('id')
            course_name = course_data.get('name')
            is_new = course_data.get('is_new', False)

            if course_id and not is_new:
                # Fetch existing course by ID
                try:
                    course = Course.objects.get(id=course_id)
                except Course.DoesNotExist:
                    return Response(
                        {'courses': [f'Course with ID {course_id} does not exist.']}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                # Create or get new course
                course, created = Course.objects.get_or_create(name=course_name)

            # Add the course to the teacher
            teacher.courses.add(course)

            # Handle associated modules
            course_modules = modules_data.get(str(course_id), [])
            for module_data in course_modules:
                module_id = module_data.get('id')
                module_name = module_data.get('name')
                is_new = module_data.get('is_new', False)

                if module_id and not is_new:
                    try:
                        module = Module.objects.get(id=module_id)
                    except Module.DoesNotExist:
                        return Response(
                            {'modules': [f'Module with ID {module_id} does not exist.']}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                else:
                    # Create or get new module
                    module, created = Module.objects.get_or_create(name=module_name, course=course)

                # Add the module to the teacher
                teacher.modules.add(module)

        # Serialize the teacher object
        serializer = TeacherSerializer(teacher)

        return Response({"message": "Teacher updated successfully", "user": serializer.data}, status=status.HTTP_200_OK)

    
class DeleteTeacherView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Teacher.objects.all()
    lookup_field = 'pk'

class TeacherDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    lookup_field = 'pk'