from django.db import models
from apps.choices.models import Choice

# Create your models here.
class Question(models.Model):
    QUESTION_TYPE_CHOICES = (
        ('mcq', 'Multiple Choice'),
        ('tf', 'True/False'),
    )
    assessment = models.ForeignKey('assessments.Assessment', on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=3, choices=QUESTION_TYPE_CHOICES)
    marks = models.PositiveIntegerField()
    # New field for True/False questions
    is_true = models.BooleanField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.question_type == 'tf':
            # Ensure choices are not created for True/False questions
            Choice.objects.filter(question=self).delete()
        super().save(*args, **kwargs)
