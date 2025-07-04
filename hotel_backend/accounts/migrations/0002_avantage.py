# Generated by Django 5.2.1 on 2025-05-10 01:36

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Avantage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('points_requis', models.PositiveIntegerField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='avantages/')),
                ('beneficiaires', models.ManyToManyField(blank=True, related_name='avantages_obtenus', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
