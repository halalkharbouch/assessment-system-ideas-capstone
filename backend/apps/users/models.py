from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.db.models import Avg, Max, Min, Count
from django.db import transaction

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    @transaction.atomic
    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('user_type', 'superuser')

        user = self.create_user(email, first_name, last_name, password, **extra_fields)
        
        # Create a Teacher object for the superuser
        Teacher.objects.create(user=user)

        return user

class User(AbstractBaseUser):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('superuser', 'Superuser'),
    )
    
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    has_set_password = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'student'})
    admission_number = models.CharField(max_length=20, unique=True)
    enrolled_course = models.ForeignKey('courses.Course', on_delete=models.SET_NULL, null=True, blank=True)
    modules = models.ManyToManyField('modules.Module')
    results = models.ManyToManyField('results.Result', related_name='students')
    completed_assessments = models.ManyToManyField('assessments.Assessment', blank=True, related_name='completed_by_students')
    @property
    def average_score(self):
        # Aggregates average score from related results
        return self.results.aggregate(Avg('score'))['score__avg'] or 0

    @property
    def highest_score(self):
        # Aggregates highest score from related results
        
        return self.results.aggregate(Max('score'))['score__max'] or 0

    @property
    def lowest_score(self):
        # Aggregates lowest score from related results
        return self.results.aggregate(Min('score'))['score__min'] or 0

    @property
    def pass_rate(self):
        # Get total number of assessments taken by the student
        total_assessments = self.results.count()
        # Calculate the number of assessments passed
        passed_assessments = self.results.filter(
            score__gte=models.F('assessment__passing_marks')
        ).count()

        # Return pass rate as a percentage
        return (passed_assessments / total_assessments * 100) if total_assessments else 0


    def __str__(self):
        return f"{self.admission_number}"

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'user_type': 'teacher'})
    courses = models.ManyToManyField('courses.Course')
    modules = models.ManyToManyField('modules.Module')

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
