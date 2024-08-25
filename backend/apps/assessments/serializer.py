from rest_framework import serializers
from .models import Assessment
from apps.choices.serializer import QuestionSerializer

class AssessmentSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = ('id', 'name', 'slug', 'module', 'created_by', 'date_created', 'date_end', 'questions')

