from rest_framework import serializers
from .models import User, Student, Teacher
from apps.courses.models import Course
from apps.modules.models import Module
from apps.assessments.models import Assessment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_active', 'is_superuser']



class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    admission_number = serializers.CharField()
    enrolled_course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), required=False, allow_null=True)
    modules = serializers.PrimaryKeyRelatedField(many=True, queryset=Module.objects.all(), required=False)

    class Meta:
        model = Student
        fields = ['user', 'admission_number', 'enrolled_course', 'modules']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user_data.setdefault('user_type', 'student')
        user_data.setdefault('is_staff', False)
        user_data.setdefault('is_active', True)
        user_data.setdefault('is_superuser', False)

        user = User.objects.create_user(**user_data)

        enrolled_course = validated_data.get('enrolled_course', None)
        if enrolled_course:
            user.enrolled_course = enrolled_course
        
        modules = validated_data.get('modules', [])
        if modules:
            user.modules.set(modules)

        student = Student.objects.create(
            user=user,
            admission_number=validated_data['admission_number'],
            enrolled_course=validated_data.get('enrolled_course', None)
        )
        if 'modules' in validated_data:
            student.modules.set(validated_data['modules'])
        return student


class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    courses = serializers.PrimaryKeyRelatedField(many=True, queryset=Course.objects.all(), required=False)
    modules = serializers.PrimaryKeyRelatedField(many=True, queryset=Module.objects.all(), required=False)
    created_assessments = serializers.PrimaryKeyRelatedField(many=True, queryset=Assessment.objects.all(), required=False)

    class Meta:
        model = Teacher
        fields = ['user', 'courses', 'modules', 'created_assessments']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        teacher = Teacher.objects.create(user=user)

        if 'courses' in validated_data:
            teacher.courses.set(validated_data['courses'])
        if 'modules' in validated_data:
            teacher.modules.set(validated_data['modules'])
        if 'created_assessments' in validated_data:
            teacher.created_assessments.set(validated_data['created_assessments'])

        return teacher
    
class SuperuserSerializer(UserSerializer):
    def create(self, validated_data):
        user = User.objects.create_superuser(**validated_data)
        return user