import os
from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_backend.settings')

# Initialize Django
import django
django.setup()

from apps.users.models import Student, Teacher, User


class CustomUserModelTests(TestCase):
    
    def setUp(self):
        self.user_data = {
            'email': 'testuser@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'password123'
        }
    
    def test_create_user(self):
        """Test creating a user is successful."""
        user = get_user_model().objects.create_user(
            email=self.user_data['email'],
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name'],
            password=self.user_data['password'],
        )
        self.assertEqual(user.email, self.user_data['email'])
        self.assertTrue(user.check_password(self.user_data['password']))
    
    def test_create_user_without_email(self):
        """Test that creating a user without an email raises an error."""
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(
                email=None,
                first_name=self.user_data['first_name'],
                last_name=self.user_data['last_name'],
                password=self.user_data['password'],
            )

    def test_create_superuser(self):
        """Test creating a superuser is successful."""
        superuser = get_user_model().objects.create_superuser(
            email=self.user_data['email'],
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name'],
            password=self.user_data['password']
        )
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_staff)

class StudentModelTests(TestCase):
    
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='student@example.com',
            first_name='Student',
            last_name='User',
            password='password123',
            user_type='student'
        )
        self.student = Student.objects.create(
            user=self.user,
            admission_number='S123456'
        )

    def test_student_creation(self):
        """Test the student is created successfully."""
        self.assertEqual(self.student.admission_number, 'S123456')
        self.assertEqual(self.student.user.email, 'student@example.com')

    def test_student_average_score(self):
        """Test the average score calculation for the student."""
        # Assuming that there are results with scores added here for testing purposes.
        self.assertEqual(self.student.average_score, 0)  # No results initially
    
    # Add similar tests for `highest_score`, `lowest_score`, and `pass_rate`

class TeacherModelTests(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='teacher@example.com',
            first_name='Teacher',
            last_name='User',
            password='password123',
            user_type='teacher'
        )
        self.teacher = Teacher.objects.create(user=self.user)

    def test_teacher_creation(self):
        """Test the teacher is created successfully."""
        self.assertEqual(self.teacher.user.email, 'teacher@example.com')
        self.assertEqual(self.teacher.user.user_type, 'teacher')




