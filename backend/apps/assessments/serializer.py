from rest_framework import serializers
from .models import Assessment
from apps.modules.serializer import ModuleSerializer
from apps.courses.serializer import CourseSerializer
from apps.questions.serializer import QuestionSerializer

class AssessmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    module = ModuleSerializer(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Assessment
        fields = '__all__'

        
