from django.db import models

class Module(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='modules')

    def __str__(self):
        return self.name
