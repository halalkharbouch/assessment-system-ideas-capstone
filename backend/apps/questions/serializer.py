from rest_framework import serializers
from .models import Question
from apps.choices.serializer import ChoiceSerializer
class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'question_text', 'question_type', 'marks', 'choices', 'is_true')