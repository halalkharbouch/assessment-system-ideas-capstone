from django.db import models

class Result(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    assessment = models.ForeignKey('assessments.Assessment', related_name='results', on_delete=models.CASCADE)
    score = models.FloatField()
    date_taken = models.DateTimeField(auto_now_add=True)
    incorrect_answers = models.JSONField(default=dict)  # Store incorrect answers as a dictionary

    def __str__(self):
        return f"{self.student} - {self.assessment}"
