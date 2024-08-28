from rest_framework import serializers
from .models import User, Student, Teacher
from apps.courses.models import Course
from apps.modules.models import Module
from apps.assessments.models import Assessment
from apps.assessments.serializer import AssessmentSerializer
from apps.courses.serializer import CourseSerializer
from apps.modules.serializer import ModuleSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_active', 'is_superuser']

    def update(self, instance, validated_data):
        print("Updating user")
        # Check if the email in validated_data is different from the current email
        if validated_data.get('email') != instance.email:
            # Check if the new email already exists
            if User.objects.filter(email=validated_data['email']).exists():
                print("Email already exists")
                # Skip the email update and update other fields
                instance.first_name = validated_data.get('first_name', instance.first_name)
                instance.last_name = validated_data.get('last_name', instance.last_name)
                instance.user_type = validated_data.get('user_type', instance.user_type)
                instance.is_staff = validated_data.get('is_staff', instance.is_staff)
                instance.is_active = validated_data.get('is_active', instance.is_active)
                instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)
                instance.save()
                return instance
        # Update user fields
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.user_type = validated_data.get('user_type', instance.user_type)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)
        instance.save()
        return instance

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    enrolled_course = CourseSerializer()
    modules = serializers.PrimaryKeyRelatedField(many=True, queryset=Module.objects.all(), required=False)

    class Meta:
        model = Student
        fields = ['id', 'user', 'admission_number', 'enrolled_course', 'modules']




class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    courses = CourseSerializer(many=True, required=False, allow_null=True)
    modules = ModuleSerializer(many=True, required=False, allow_null=True)
    assessments_created = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = '__all__'

    def get_assessments_created(self, obj):
        # Get the assessments created by the teacher
        assessments = Assessment.objects.filter(created_by=obj)
        return AssessmentSerializer(assessments, many=True).data

    
class SuperuserSerializer(UserSerializer):
    def create(self, validated_data):
        user = User.objects.create_superuser(**validated_data)
        return user

class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")
        return value
