from django.urls import path,include
from .views import CourseListView, CourseDetailView, CreateCourseView, UpdateCourseView, DeleteCourseView, StudentAssessmentListView
urlpatterns = [
    path('courses/', CourseListView.as_view(), name="list-courses"),
    path('courses/create/', CreateCourseView.as_view(), name="create-course"),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name="course-detail"),
    path('courses/delete/<int:pk>/', DeleteCourseView.as_view(), name="delete-course"),
    path('courses/update/<int:pk>/', UpdateCourseView.as_view(), name="update-course"),

    path('courses/<int:course_id>/assessments/', StudentAssessmentListView.as_view(), name='student_assessments'),

]
