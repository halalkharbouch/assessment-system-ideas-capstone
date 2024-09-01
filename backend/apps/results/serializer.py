from rest_framework import serializers
from .models import Result
from apps.assessments.serializer import AssessmentMiniSerializer
from apps.users.models import Student

class ResultSerializer(serializers.ModelSerializer):
    assessment = AssessmentMiniSerializer()
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    class Meta:
        model = Result
        fields = ['id', 'student', 'assessment', 'score', 'date_taken', 'incorrect_answers']

    def create(self, validated_data):
        return Result.objects.create(**validated_data)