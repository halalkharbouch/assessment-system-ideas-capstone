from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views.student_views import ListStudentView, CreateStudentView, UpdateStudentView, DeleteStudentView, StudentDetailView, score_trends, pass_rate, assessment_performance, radar_chart_data, assessment_performance_for_insights
from .views.superuser_views import ListSuperusersView, CreateSuperuserView, UpdateSuperuserView, SuperuserDetailView
from .views.teacher_views import ListTeachersView, CreateTeacherView, TeacherDetailView, UpdateTeacherView, DeleteTeacherView
from .views.user_views import ListUsersView, DeleteUserView, UpdateUserView, CurrentUserView , CheckUserExists, SetPassword, LoginView, LogoutView

urlpatterns = [
    path('users/create/student/', CreateStudentView.as_view(), name='create-student'),
    path('users/students/', ListStudentView.as_view(), name='list-student'),
    path('users/student/<int:pk>/', StudentDetailView.as_view(), name='student-detail'),
    path('users/update/student/<int:pk>/', UpdateStudentView.as_view(), name='update-student'),
    path('users/delete/student/<int:pk>/', DeleteStudentView.as_view(), name='delete-student'),
    path('users/create/teacher/', CreateTeacherView.as_view(), name='create-teacher'),
    path('users/teachers/', ListTeachersView.as_view(), name='list-teacher'),
    path('users/teacher/<int:pk>/', TeacherDetailView.as_view(), name='teacher-detail'),
    path('users/update/teacher/<int:pk>/', UpdateTeacherView.as_view(), name='update-teacher'),
    path('users/delete/teacher/<int:pk>/', DeleteTeacherView.as_view(), name='delete-teacher'),
    path('users/create/superuser/', CreateSuperuserView.as_view(), name='create-superuser'),
    path('users/superusers/', ListSuperusersView.as_view(), name='list-superuser'),
    path('users/superuser/<int:pk>/', SuperuserDetailView.as_view(), name='superuser-detail'),
    path('users/update/superuser/<int:pk>/', UpdateSuperuserView.as_view(), name='update-superuser'),
    path('users/', ListUsersView.as_view(), name='list-users'),
    path('users/delete/<int:pk>/', DeleteUserView.as_view(), name='delete-user'),
    path('users/update/<int:pk>/', UpdateUserView.as_view(), name='update-user'),
    path('users/current/', CurrentUserView.as_view(), name='current-user'),

    path('score-trends/', score_trends, name='score-trends'),
    path('pass-rate/', pass_rate, name='pass-rate'),
    path('assessment-performance/', assessment_performance, name='assessment-performance'),
    path('radar-data/', radar_chart_data, name='radar-chart-data'),
    path('assessment-performance-for-insights/', assessment_performance_for_insights, name='assessment-performance-for-insights'),


    # Authentication
    path('auth/check-user-exists/', CheckUserExists.as_view(), name='check-user-exists'),
    path('auth/<int:pk>/set-password/', SetPassword.as_view(), name='set-password'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    

]
