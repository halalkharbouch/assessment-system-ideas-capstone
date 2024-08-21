from django.db import models

class Assessment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    module = models.ForeignKey('modules.Module', on_delete=models.CASCADE, related_name='assessments')
    created_by = models.ForeignKey('users.Teacher', on_delete=models.CASCADE, related_name='assessments_created')
    date_created = models.DateTimeField(auto_now_add=True)
    questions = models.JSONField(default=list, help_text="List of questions for this assessment")

    def __str__(self):
        return self.name
