from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Teacher, Student


admin.site.register(User)
admin.site.register(Student)
admin.site.register(Teacher)