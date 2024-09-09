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
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserViewsTests(APITestCase):

    def setUp(self):
        # Create users
        self.staff_user = User.objects.create_user(
            email='staff@example.com',
            password='testpassword',
            user_type='teacher',
            first_name='Staff',
            last_name='User',
            is_staff=True
        )
        self.student_user = User.objects.create_user(
            email='student@example.com',
            password='testpassword',
            user_type='student',
            first_name='Student',
            last_name='User'
        )
        self.superuser = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpassword',
            first_name='Super',
            last_name='Admin'
        )

        # Create a teacher record associated with the staff_user
        self.teacher_record = Teacher.objects.create(user=self.staff_user)
        # Create a student record associated with the student_user
        self.student_record = Student.objects.create(user=self.student_user, admission_number="test123")
        
        # Create client for API requests
        self.client = APIClient()

        # Token generation for users
        self.staff_token = RefreshToken.for_user(self.staff_user).access_token
        self.student_token = RefreshToken.for_user(self.student_user).access_token
        self.superuser_token = RefreshToken.for_user(self.superuser).access_token
        self.student_refresh_token = str(RefreshToken.for_user(self.student_user))


        # Endpoints
        self.login_url = reverse('login')
        self.current_user_url = reverse('current-user')
        self.list_users_url = reverse('list-users')
        self.set_password_url = reverse('set-password', kwargs={'pk': self.student_user.pk})

    def test_login_user(self):
        # Test login with valid credentials
        response = self.client.post(self.login_url, {'email': 'student@example.com', 'password': 'testpassword'})

        # Print response content for debugging
        print(response.data)  # This will print the error details in case of failure

        # Assert that login is successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.data)
        self.assertIn('refresh_token', response.data)
    
    def test_login_invalid_credentials(self):
        # Test login with invalid credentials
        response = self.client.post(self.login_url, {'email': 'invalid@example.com', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_current_user(self):
        # Authenticate with a valid token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.staff_token}')
        
        # Test getting the current user
        response = self.client.get(self.current_user_url)
        
        # Print response content for debugging
        print(response.data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['user']['email'], 'staff@example.com')

    
    def test_get_current_user_without_auth(self):
        # Test accessing the current user without authentication
        response = self.client.get(self.current_user_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_users(self):
        # Authenticate with a superuser
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.superuser_token}')
        
        # Test listing all users
        response = self.client.get(self.list_users_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)  # There should be at least 1 user
    
    def test_set_password(self):
        # Authenticate with a valid token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.student_token}')
        
        # Test setting password for the user
        response = self.client.post(self.set_password_url, {'password': 'newpassword'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_check_user_exists(self):
        # Test user existence check
        response = self.client.post(reverse('check-user-exists'), {'email': 'student@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['exists'])
           
        # Print response content for debugging
        print(response.data)  # This will print the error details in case of failure

        # Check that the response is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)



    def test_delete_user(self):
        # Authenticate with a staff token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.staff_token}')
        
        # Test deleting a user
        delete_url = reverse('delete-user', kwargs={'pk': self.student_user.pk})
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_user(self):
        # Authenticate with a staff token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.staff_token}')
        
        # Test updating a user
        update_url = reverse('update-user', kwargs={'pk': self.student_user.pk})
        response = self.client.patch(update_url, {'email': 'updatedemail@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'updatedemail@example.com')