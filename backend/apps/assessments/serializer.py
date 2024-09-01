from rest_framework import serializers
from .models import Assessment
from apps.courses.serializer import CourseSerializer
from apps.questions.serializer import QuestionSerializer

class AssessmentSerializer(serializers.ModelSerializer):
    course = serializers.SerializerMethodField()
    module = serializers.SerializerMethodField()
    created_by = serializers.StringRelatedField(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = '__all__'

    def get_course(self, obj):
        from apps.courses.serializer import CourseSerializer
        serializer = CourseSerializer(obj.course)
        return serializer.data

    def get_module(self, obj):
        from apps.modules.serializer import ModuleSerializer
        serializer = ModuleSerializer(obj.module)
        return serializer.data


class AssessmentMiniSerializer(serializers.ModelSerializer):
    # Define a mini serializer for assessments with only the required fields
    questions = serializers.SerializerMethodField()
    course = serializers.StringRelatedField()
    module = serializers.StringRelatedField()

    class Meta:
        model = Assessment
        fields = ('id', 'name', 'module', 'course', 'questions', 'is_published', 'start_date', 'end_date', 'time_limit', 'total_marks', 'passing_marks', 'created_by', 'description')

    def get_questions(self, obj):
        from apps.questions.serializer import QuestionSerializer
        # Use only essential fields for questions to avoid deep recursion
        questions = obj.questions.all()
        return QuestionSerializer(questions, many=True).data