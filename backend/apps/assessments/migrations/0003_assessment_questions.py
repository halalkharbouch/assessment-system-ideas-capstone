# Generated by Django 5.1 on 2024-08-18 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessments', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='assessment',
            name='questions',
            field=models.JSONField(default=list, help_text='List of questions for this assessment'),
        ),
    ]
