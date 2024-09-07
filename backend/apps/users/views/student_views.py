from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers import StudentSerializer, UserSerializer, RadarChartSerializer
from rest_framework.views import APIView
from ..models import Student, User
from apps.courses.models import Course
from apps.modules.models import Module
from rest_framework.permissions import IsAuthenticated
from django_backend.permissions import IsStaffUser, IsSuperuser
from rest_framework.decorators import api_view
from apps.results.models import Result
from django.db.models import Count, F, Sum, Avg, Max, Min


class CreateStudentView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def post(self, request):
        importing_students = request.data.get('importing_students', False)

        students = []

        if importing_students:
            all_students = request.data.get('students', [])



            for student in all_students:
                first_name = student.get('first_name')
                last_name = student.get('last_name')
                email = student.get('email')
                admission_number = student.get('admission_number')

                course = Course.objects.get(id=student.get('courseId'))

                user = User.objects.create_user(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    is_staff=False,  
                    is_active=True,
                    is_superuser=False 
                )
                user.set_password('winter50%')
                user.save()
                student = Student.objects.create(
                    user=user,
                    enrolled_course=course,
                    admission_number=admission_number
                )
                student.save()

                students.append(student)
            return Response({"message": "Student created successfully", "users": StudentSerializer(students, many=True).data}, status=status.HTTP_201_CREATED)

        else:
            # Extract data from the request
            user_data = request.data.get('user', {})
            enrolled_course_data = request.data.get('enrolled_course', {})
            modules_data = request.data.get('modules', [])

            

            # Validate required fields
            validation_error = self._validate_required_fields(user_data)
            if validation_error:
                return validation_error

            # Create the User and Student objects
            user = self._create_user(user_data)
            student = self._create_student(user, request.data)

            # Handle enrolled course
            student.enrolled_course = self._handle_enrolled_course(enrolled_course_data)

            # Handle modules
            self._handle_modules(student, modules_data)

            # Save the student object
            student.save()

            # Serialize and return the student object
            serializer = StudentSerializer(student)
            return Response({"message": "Student created successfully", "user": serializer.data}, status=status.HTTP_201_CREATED)

    def _validate_required_fields(self, user_data):
        required_fields = ['first_name', 'last_name', 'email', 'password']
        for field in required_fields:
            if not user_data.get(field):
                return Response({'detail': f'{field.replace("_", " ").title()} is required.'}, status=status.HTTP_400_BAD_REQUEST)
        return None

    def _create_user(self, user_data):
        user = User(
            first_name=user_data.get('first_name'),
            last_name=user_data.get('last_name'),
            email=user_data.get('email'),
            is_staff=False,  
            is_active=True,
            is_superuser=False  
        )
        user.set_password(user_data.get('password'))
        user.save()
        return user

    def _create_student(self, user, data):
        return Student.objects.create(
            user=user,
            admission_number=data.get('admission_number', '')
        )

    def _handle_enrolled_course(self, enrolled_course_data):
        course_id = enrolled_course_data.get('value')
        course_name = enrolled_course_data.get('label')
        is_new = enrolled_course_data.get('is_new', False)

        if course_id and not is_new:
            try:
                return Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                raise Response(
                    {'detail': f"Course with ID {course_id} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Course.objects.get_or_create(name=course_name)[0]

    def _handle_modules(self, student, modules_data):
        for module_data in modules_data:
            module_id = module_data.get('id')
            module_name = module_data.get('name')
            is_new = module_data.get('is_new', False)

            if module_id and not is_new:
                try:
                    module = Module.objects.get(id=module_id)
                except Module.DoesNotExist:
                    raise Response(
                        {'detail': f"Module with ID {module_id} does not exist."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                module = Module.objects.get_or_create(name=module_name)[0]

            student.modules.add(module)


class ListStudentView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    serializer_class = StudentSerializer

    def get_queryset(self):
        queryset = Student.objects.all()
        course_id = self.request.query_params.get('course', None)
        if course_id:
            queryset = queryset.filter(enrolled_course=course_id)
            print(queryset)
        return queryset

class UpdateStudentView(APIView):
    permission_classes = [IsAuthenticated, IsStaffUser]

    def put(self, request, pk):
        # Retrieve the student object
        try:
            student = Student.objects.get(id=pk)
        except Student.DoesNotExist:
            return Response(
                {'detail': 'Student not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Extract data from the request
        user_data = request.data.get('user', {})
        enrolled_course_data = request.data.get('enrolled_course', {})
        modules_data = request.data.get('modules', [])

        # Update user information
        user = student.user
        for field in ['first_name', 'last_name', 'email']:
            setattr(user, field, user_data.get(field, getattr(user, field)))
        user.save()

        # Update enrolled course
        student.enrolled_course = self._handle_enrolled_course(enrolled_course_data)

        # Update modules
        student.modules.set(self._handle_modules(modules_data))

        # Save the updated student object
        student.save()

        # Serialize the student object
        serializer = StudentSerializer(student)

        return Response({"message": "Student updated successfully", "user": serializer.data}, status=status.HTTP_200_OK)

    def _handle_enrolled_course(self, enrolled_course_data):
        course_id = enrolled_course_data.get('id')
        course_name = enrolled_course_data.get('name')
        is_new = enrolled_course_data.get('is_new', False)

        if course_id and not is_new:
            try:
                return Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                raise Response(
                    {'detail': f"Course with ID {course_id} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Course.objects.get_or_create(name=course_name)[0]

    def _handle_modules(self, modules_data):
        modules = []
        for module_data in modules_data:
            module_id = module_data.get('id')
            module_name = module_data.get('name')
            is_new = module_data.get('is_new', False)

            if module_id and not is_new:
                try:
                    modules.append(Module.objects.get(id=module_id))
                except Module.DoesNotExist:
                    raise Response(
                        {'detail': f"Module with ID {module_id} does not exist."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                modules.append(Module.objects.get_or_create(name=module_name)[0])
        return modules
    
class DeleteStudentView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsStaffUser]
    queryset = Student.objects.all()
    lookup_field = 'pk'

class StudentDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'pk'


@api_view(['GET'])
def score_trends(request):
    course_id = request.query_params.get('course', None)
    
    # Filter results by course if course_id is provided
    results = Result.objects.all()
    if course_id:
        results = results.filter(assessment__course_id=course_id)

    # Aggregate data
    trends = (
        results
        .values('date_taken__date')
        .annotate(avg_score=Avg('score'))
        .order_by('date_taken__date')
    )
    
    # Format data for the chart
    score_trend_data = [
        {'date': trend['date_taken__date'], 'score': trend['avg_score']}
        for trend in trends
    ]
    
    return Response(score_trend_data)


@api_view(['GET'])
def pass_rate(request):
    course_id = request.query_params.get('course', None)
    
    # Filter students by course if course_id is provided
    students = Student.objects.all()
    if course_id:
        students = students.filter(enrolled_course_id=course_id)

    # Calculate pass and fail counts
    pass_count = 0
    fail_count = 0

    for student in students:
        total_assessments = student.results.count()
        if total_assessments > 0:
            passed_assessments = student.results.filter(
                score__gte=F('assessment__passing_marks')
            ).count()

            pass_rate_percentage = (passed_assessments / total_assessments * 100) if total_assessments else 0

            if pass_rate_percentage >= 50:  # Assuming 50% is the threshold for pass
                pass_count += 1
            else:
                fail_count += 1
    
    # Prepare data for the pie chart
    pass_rate_data = [
        {'name': 'Passed', 'value': pass_count},
        {'name': 'Failed', 'value': fail_count},
    ]
    
    return Response(pass_rate_data)

@api_view(['GET'])
def assessment_performance(request):
    course_id = request.query_params.get('course', None)
    
    # Filter results by course if course_id is provided
    results = Result.objects.all()
    if course_id:
        results = results.filter(assessment__course_id=course_id)

    # Aggregate data for each student and assessment
    performance_data = (
        results
        .select_related('assessment')  # Fetch related assessment data
        .values('student__user__first_name', 'student__user__last_name', 'assessment__name')
        .annotate(total_score=Sum('score'))
        .order_by('student__user__first_name', 'student__user__last_name', 'assessment__name')
    )

    # Create a mapping of assessment names to unique identifiers
    assessments = performance_data.values_list('assessment__name', flat=True).distinct()
    
    # Format data for the stacked bar chart
    student_names = performance_data.values_list('student__user__first_name', 'student__user__last_name').distinct()
    stacked_data = []
    
    for name in student_names:
        first_name, last_name = name
        student_data = performance_data.filter(
            student__user__first_name=first_name,
            student__user__last_name=last_name
        )
        data = {'name': f'{first_name} {last_name}'}
        for assessment in assessments:
            # Add each assessment's score or 0 if no score is present
            score = student_data.filter(assessment__name=assessment).aggregate(total=Sum('total_score'))['total'] or 0
            data[assessment] = score
        stacked_data.append(data)

    return Response(stacked_data)


@api_view(['GET'])
def radar_chart_data(request):
    course_id = request.query_params.get('course', None)
    
    # Filter results by course if course_id is provided
    results = Result.objects.all()
    if course_id:
        results = results.filter(assessment__course_id=course_id)

    # Aggregate data by subject or assessment type
    radar_data = (
        results
        .values('assessment__name')
        .annotate(score=Avg('score'))
        .values('assessment__name', 'score')
    )
    
    # Convert to a format suitable for the radar chart
    formatted_data = [
        {'subject': item['assessment__name'], 'score': item['score']}
        for item in radar_data
    ]

    # Serialize and return the data
    serializer = RadarChartSerializer(formatted_data, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def assessment_performance_for_insights(request):
    course_id = request.query_params.get('course', None)
    
    # Filter results by course if course_id is provided
    results = Result.objects.all()
    if course_id:
        results = results.filter(assessment__course_id=course_id)

    # Aggregate data for each assessment
    performance_data = (
        results
        .values('assessment__name')
        .annotate(
            average_score=Avg('score'),
            highest_score=Max('score'),
            lowest_score=Min('score')
        )
        .order_by('assessment__name')
    )
    
    # Format data for the bar chart
    assessment_performance_data = [
        {
            'name': data['assessment__name'],
            'averageScore': data['average_score'],
            'highestScore': data['highest_score'],
            'lowestScore': data['lowest_score'],
        }
        for data in performance_data
    ]
    
    return Response(assessment_performance_data)
