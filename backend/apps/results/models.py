from django.db import models

class Result(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    assessment = models.ForeignKey('assessments.Assessment', on_delete=models.CASCADE)
    score = models.FloatField()

    def __str__(self):
        return f"{self.student} - {self.assessment}"
