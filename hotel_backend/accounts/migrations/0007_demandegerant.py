# Generated by Django 5.1.7 on 2025-05-12 07:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0006_tablerestaurant_image_alter_tablerestaurant_numero'),
    ]

    operations = [
        migrations.CreateModel(
            name='DemandeGerant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=100)),
                ('prenom', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('telephone', models.CharField(max_length=20)),
                ('type_gerant', models.CharField(choices=[('hotel', "Gérant d'hôtel"), ('restaurant', 'Gérant de restaurant')], max_length=20)),
                ('message', models.TextField()),
                ('date_envoi', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
