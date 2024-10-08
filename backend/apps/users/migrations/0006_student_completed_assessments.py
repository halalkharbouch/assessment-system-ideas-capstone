# Generated by Django 5.1 on 2024-08-30 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0006_assessment_course'),
        ('users', '0005_remove_teacher_created_assessments'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='completed_assessments',
            field=models.ManyToManyField(blank=True, related_name='completed_by_students', to='assessments.assessment'),
        ),
    ]
