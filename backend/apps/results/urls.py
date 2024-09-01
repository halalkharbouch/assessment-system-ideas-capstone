from django.urls import path
from .views import DeleteResultView, UserResultsView, ResultDetailView


urlpatterns = [
    path('results/delete/<int:pk>/', DeleteResultView.as_view(), name='delete-result'),
    path('results/user/', UserResultsView.as_view(), name='user-results'),
    path('results/<int:pk>/', ResultDetailView.as_view(), name='result-detail'),

]