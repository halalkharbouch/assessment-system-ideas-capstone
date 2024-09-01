from django.urls import path
from .views import (
    AssessmentListView,
    CreateAssessmentView,
    UpdateAssessmentView,
    DeleteAssessmentView,
    AssessmentDetailView,
    UpdateAssessmentStatusView,
    AssessmentsByModuleView,
    SubmitAssessmentView,
    CurrentUserAssessmentsView
)

urlpatterns = [
    path('assessments/', AssessmentListView.as_view(), name='list-assessments'),
    path('assessments/create/', CreateAssessmentView.as_view(), name='create-assessment'),
    path('assessments/<int:pk>/', AssessmentDetailView.as_view(), name='assessment-detail'),
    path('assessments/update/<int:pk>/', UpdateAssessmentView.as_view(), name='update-assessment'),
    path('assessments/delete/<int:pk>/', DeleteAssessmentView.as_view(), name='delete-assessment'),
    path('assessments/module/<int:module_id>/', AssessmentsByModuleView.as_view(), name='assessments-by-module'),
    path('assessments/submit/<int:assessment_id>/', SubmitAssessmentView.as_view(), name='submit-assessment'),

    path('assessments/current-user/', CurrentUserAssessmentsView.as_view(), name='current-user-assessments'),

    path('assessments/update-status/<int:pk>/', UpdateAssessmentStatusView.as_view(), name='update-assessment-status'),
]
