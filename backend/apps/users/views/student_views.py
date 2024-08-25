from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers import StudentSerializer, UserSerializer
from rest_framework.views import APIView
from ..models import Student, User
from apps.courses.models import Course
from apps.modules.models import Module

class CreateStudentView(APIView):

    def post(self, request):
        # Extract data from the request
        user_data = request.data.get('user', {})
        enrolled_course_data = request.data.get('enrolled_course', {})
        modules_data = request.data.get('modules', [])

        # Create the User object
        user = User(
            first_name=user_data.get('first_name'),
            last_name=user_data.get('last_name'),
            email=user_data.get('email'),
            is_staff=False,  # Assuming students are not staff
            is_active=True,
            is_superuser=False  # Assuming students are not superusers
        )
        user.set_password(user_data.get('password'))  # Setting a password if provided
        user.save()

        # Create the Student object
        student = Student.objects.create(
            user=user,
            admission_number=request.data.get('admission_number', '')
        )

        # Handle enrolled course
        if enrolled_course_data:
            try:
                course = Course.objects.get(id=enrolled_course_data.get('id'))
            except Course.DoesNotExist:
                return Response(
                    {'detail': f"Course with ID {enrolled_course_data.get('id')} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            student.enrolled_course = course

        # Handle modules
        for module_data in modules_data:
            module_id = module_data.get('id')
            module_name = module_data.get('name')
            is_new = module_data.get('is_new', False)

            if module_id and not is_new:
                try:
                    module = Module.objects.get(id=module_id)
                except Module.DoesNotExist:
                    return Response(
                        {'detail': f"Module with ID {module_id} does not exist."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                # Create or get a new module
                module, created = Module.objects.get_or_create(name=module_name)

            # Add the module to the student
            student.modules.add(module)

        # Save the student object
        student.save()

        # Manually serialize the student object
        student_data = {
            "id": student.id,
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
            "admission_number": student.admission_number,
            "enrolled_course": {
                "id": student.enrolled_course.id,
                "name": student.enrolled_course.name,
            } if student.enrolled_course else None,
            "modules": [
                {"id": module.id, "name": module.name} for module in student.modules.all()
            ]
        }

        return Response({"message": "Student created successfully", "data": student_data}, status=status.HTTP_201_CREATED)


class ListStudentView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class UpdateStudentView(APIView):

    def put(self, request, pk):
        # Retrieve the student object
        try:
            student = Student.objects.get(id=pk)
        except Student.DoesNotExist:
            return Response(
                {'detail': 'Student not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Extract user data from the request
        user_data = request.data.get('user', {})
        enrolled_course_data = request.data.get('enrolled_course', {})
        modules_data = request.data.get('modules', [])

        # Update user information
        user = student.user
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.email = user_data.get('email', user.email)
        user.save()

        # Update enrolled course
        student.enrolled_course = None
        if enrolled_course_data:
            try:
                course = Course.objects.get(id=enrolled_course_data.get('id'))
            except Course.DoesNotExist:
                return Response(
                    {'detail': f"Course with ID {enrolled_course_data.get('id')} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            student.enrolled_course = course

        # Update modules
        # Clear existing modules first
        student.modules.clear()

        for module_data in modules_data:
            module_id = module_data.get('id')
            module_name = module_data.get('name')
            is_new = module_data.get('is_new', False)

            if module_id and not is_new:
                # Fetch existing module by ID
                try:
                    module = Module.objects.get(id=module_id)
                except Module.DoesNotExist:
                    return Response(
                        {'detail': f"Module with ID {module_id} does not exist."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                # Create or get new module
                module, created = Module.objects.get_or_create(name=module_name)

            # Add the module to the student
            student.modules.add(module)

        # Save the updated student object
        student.save()

        # Serialize the student object manually
        student_data = {
            "id": student.id,
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
            "admission_number": student.admission_number,
            "enrolled_course": {
                "id": student.enrolled_course.id,
                "name": student.enrolled_course.name,
            } if student.enrolled_course else None,
            "modules": [
                {"id": module.id, "name": module.name} for module in student.modules.all()
            ]
        }

        return Response({"message": "Student updated successfully", "data": student_data}, status=status.HTTP_200_OK)

    
class DeleteStudentView(generics.DestroyAPIView):
    queryset = Student.objects.all()
    lookup_field = 'pk'

class StudentDetailView(generics.RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'pk'

