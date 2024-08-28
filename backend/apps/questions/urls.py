from django.urls import path
from .views import AddQuestionView, UpdateQuestionView, DeleteQuestionView

urlpatterns = [
    path('questions/<int:assessment_id>/create/', AddQuestionView.as_view(), name='add-question'),
    path('questions/<int:question_id>/update/', UpdateQuestionView.as_view(), name='update-question'),
    path('questions/<int:question_id>/delete/', DeleteQuestionView.as_view(), name='delete-question'),
]