from django.urls import path
from .views import ModuleListView, ModuleDetailView, ModuleCreateView, ModuleDeleteView, ModuleUpdateView

urlpatterns = [
    path('modules/', ModuleListView.as_view(), name="list-modules"),
    path('modules/create/', ModuleCreateView.as_view(), name="create-module"),
    path('modules/<int:pk>/', ModuleDetailView.as_view(), name="module-detail"),
    path('modules/delete/<int:pk>/', ModuleDeleteView.as_view(), name="delete-module"),
    path('modules/update/<int:pk>/', ModuleUpdateView.as_view(), name="update-module"),
]