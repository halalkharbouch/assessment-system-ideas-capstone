from django.db import models
# Create your models here.
class Choice(models.Model):
    question = models.ForeignKey('questions.Question', on_delete=models.CASCADE, related_name='choices')
    choice_text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.question.question_type == 'tf':
            raise ValueError("Choices should not be created for True/False questions")
        super().save(*args, **kwargs)