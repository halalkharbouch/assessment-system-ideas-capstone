from rest_framework import serializers, viewsets
from .models import User

# Student serializer
from .models import Student
from apps.courses.serializer import CourseSerializer, CourseMiniSerializer
from apps.modules.models import Module

# Teacher serializer
from .models import Teacher
from apps.modules.serializer import ModuleSerializer
from apps.assessments.serializer import AssessmentSerializer

from apps.results.serializer import ResultSerializer



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_active', 'is_superuser']

    def update(self, instance, validated_data):
        email = validated_data.get('email', instance.email)
        if email != instance.email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists")

        instance.email = email
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.user_type = validated_data.get('user_type', instance.user_type)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)
        instance.save()
        return instance


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, allow_null=True)
    enrolled_course = CourseMiniSerializer(required=False, allow_null=True)
    average_score = serializers.ReadOnlyField()
    highest_score = serializers.ReadOnlyField()
    lowest_score = serializers.ReadOnlyField()
    pass_rate = serializers.ReadOnlyField()
    results = ResultSerializer(many=True, required=False, allow_null=True)

    class Meta:
        model = Student
        fields = ['id', 'user', 'admission_number', 'enrolled_course', 'average_score', 'highest_score', 'lowest_score', 'pass_rate', 'results', 'completed_assessments']

class StudentMiniSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, allow_null=True)
    enrolled_course = CourseMiniSerializer(required=False, allow_null=True)
    average_score = serializers.ReadOnlyField()
    highest_score = serializers.ReadOnlyField()
    lowest_score = serializers.ReadOnlyField()
    pass_rate = serializers.ReadOnlyField()
    results = ResultSerializer(many=True, required=False, allow_null=True)

    class Meta:
        model = Student
        fields = ['id', 'user', 'admission_number', 'enrolled_course', 'average_score', 'highest_score', 'lowest_score', 'pass_rate', 'results', 'completed_assessments']



class StudentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, allow_null=True)
    courses = CourseSerializer(many=True, required=False, allow_null=True)
    modules = ModuleSerializer(many=True, required=False, allow_null=True)
    assessments_created = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = '__all__'

    def get_assessments_created(self, obj):
        assessments = obj.assessments_created.all()
        return AssessmentSerializer(assessments, many=True).data
    


class SuperuserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return User.objects.create_superuser(**validated_data)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_active', 'is_superuser']



class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")
        return value

class ScoreTrendSerializer(serializers.Serializer):
    date = serializers.DateField()
    score = serializers.FloatField()

class RadarChartSerializer(serializers.Serializer):
    subject = serializers.CharField()
    score = serializers.FloatField()