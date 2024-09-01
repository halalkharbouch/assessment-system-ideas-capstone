from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout 
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from ..serializers import UserSerializer, SetPasswordSerializer, SuperuserSerializer, TeacherSerializer, StudentSerializer, StudentMiniSerializer
from ..models import User, Student, Teacher
from django.contrib.auth import get_user_model

CurrentUser = get_user_model()

class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Prepare user data based on user type
        if user.user_type == 'student':  # Check if user is a student
            try:
                student = Student.objects.get(user=user)
                user_data = StudentMiniSerializer(student).data
            except Student.DoesNotExist:
                return Response({"error": "No associated student record found."}, status=status.HTTP_400_BAD_REQUEST)
        elif user.user_type == 'teacher' or user.is_superuser:  # Check if user is a teacher
            try:
                teacher = Teacher.objects.get(user=user)
                user_data = TeacherSerializer(teacher).data
            except Teacher.DoesNotExist:
                return Response({"error": "No associated teacher record found."}, status=status.HTTP_400_BAD_REQUEST)
        else:  # Handle other user types or superuser
            user_data = UserSerializer(user).data

        return Response({
            "message": "User data retrieved successfully",
            "user": user_data,
        }, status=status.HTTP_200_OK)

class ListUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class DeleteUserView(generics.DestroyAPIView):
    queryset = User.objects.all()
    lookup_field = 'pk'

class UpdateUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'

class CheckUserExists(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        print(email)
        try:
            user = User.objects.get(email=email)
            print(user)
            return Response({"exists": True, "has_set_password": user.has_set_password, "id": user.id})
        except User.DoesNotExist:
            return Response({"exists": False})

class SetPassword(APIView):
    def post(self, request, pk):
        try:
            print("PK: ", pk)
            print("DATA: ", request.data)
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        # Get the password from request data
        password = request.data.get('password')
        print("PASWORD: ", password)
        if not password:
            return Response({"error": "Password is required."}, status=400)

        # Validate the password
        if len(password) < 6:
            return Response({"error": "Password must be at least 6 characters long."}, status=400)

        # Set the password and save the user
        user.set_password(password)
        user.has_set_password = True
        user.save()

        # Log in the user
        login(request, user)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Prepare user data based on user type
        if user.user_type == 'student':
            try:
                student = Student.objects.get(user=user)
                user_data = StudentMiniSerializer(student).data
            except Student.DoesNotExist:
                return Response({"error": "No associated student record found."}, status=400)
        elif user.user_type == 'teacher' or user.is_superuser:
            try:
                teacher = Teacher.objects.get(user=user)
                user_data = TeacherSerializer(teacher).data
            except Teacher.DoesNotExist:
                return Response({"error": "No associated teacher record found."}, status=400)
        else:  # Handle other user types or superuser
            user_data = UserSerializer(user).data

        return Response({
            "message": "Password set and logged in successfully",
            "user": user_data,
            "access_token": access_token,
            "refresh_token": refresh_token,
        }, status=status.HTTP_200_OK)
    

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Prepare user data based on user type
        if user.user_type == 'student':
            try:
                student = Student.objects.get(user=user)
                user_data = StudentMiniSerializer(student).data
                print("serialized data", user_data)
            except Student.DoesNotExist:
                return Response({"error": "No associated student record found."}, status=status.HTTP_400_BAD_REQUEST)
        elif user.user_type == 'teacher' or user.is_superuser:
            try:
                teacher = Teacher.objects.get(user=user)
                user_data = TeacherSerializer(teacher).data
            except Teacher.DoesNotExist:
                return Response({"error": "No associated teacher record found."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user_data = UserSerializer(user).data

        return Response({
            "message": "Login successful",
            "user": user_data,
            "access_token": access_token,
            "refresh_token": refresh_token,
        })
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


