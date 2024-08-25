from django.db import models
from django.utils.text import slugify


class Module(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)
    description = models.TextField()
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='modules')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(Module, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
