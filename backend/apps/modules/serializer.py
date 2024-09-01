from rest_framework import serializers
from .models import Module

class ModuleSerializer(serializers.ModelSerializer):
    assessments = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = '__all__'

    def get_assessments(self, obj):
        from apps.assessments.serializer import AssessmentMiniSerializer
        # Fetch only the necessary fields
        assessments = obj.assessments.all()
        serializer = AssessmentMiniSerializer(assessments, many=True)
        return serializer.data
    

class ModuleMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'name']
