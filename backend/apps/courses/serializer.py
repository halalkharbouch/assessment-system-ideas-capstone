from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True, required=False)
    name = serializers.CharField(read_only=True, required=False)
    modules = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_modules(self, obj):
        from apps.modules.serializer import ModuleSerializer
        return ModuleSerializer(obj.modules.all(), many=True).data
    
class CourseMiniSerializer(serializers.ModelSerializer):
    modules = serializers.StringRelatedField(many=True)
    class Meta:
        model = Course
        fields = '__all__'
