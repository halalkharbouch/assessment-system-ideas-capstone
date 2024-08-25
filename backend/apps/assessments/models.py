from django.db import models

class Assessment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    module = models.ForeignKey('modules.Module', on_delete=models.CASCADE, related_name='assessments')
    created_by = models.ForeignKey('users.Teacher', on_delete=models.CASCADE, related_name='assessments_created')
    date_created = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    time_limit = models.DurationField(null=True, blank=True)
    total_marks = models.PositiveIntegerField()
    passing_marks = models.PositiveIntegerField()

    is_published = models.BooleanField(default=False)



    def __str__(self):
        return self.name
