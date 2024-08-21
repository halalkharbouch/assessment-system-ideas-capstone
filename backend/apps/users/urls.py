from django.urls import path
from .views.student_views import ListStudentView, CreateStudentView
from .views.superuser_views import ListSuperusersView, CreateSuperuserView
from .views.teacher_views import ListTeachersView, CreateTeacherView
from .views.user_views import ListUsersView

urlpatterns = [
    path('users/create/student/', CreateStudentView.as_view(), name='create-student'),
    path('users/students/', ListStudentView.as_view(), name='list-student'),
    path('users/create/teacher/', CreateTeacherView.as_view(), name='create-teacher'),
    path('users/teachers/', ListTeachersView.as_view(), name='list-teacher'),
    path('users/create/superuser/', CreateSuperuserView.as_view(), name='create-superuser'),
    path('users/superusers/', ListSuperusersView.as_view(), name='list-superuser'),
    path('users/', ListUsersView.as_view(), name='list-users'),
]
