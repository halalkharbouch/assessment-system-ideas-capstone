from rest_framework import serializers
from .models import Course
from apps.modules.serializer import ModuleSerializer


class CourseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True, required=False)
    name = serializers.CharField(read_only=True, required=False)
    modules = ModuleSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = '__all__'