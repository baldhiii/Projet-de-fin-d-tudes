from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from .managers import UserAccountManager
from django.conf import settings
from django.utils import timezone



# === GESTIONNAIRE D’UTILISATEUR PERSONNALISÉ ===
class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est requise")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_admin", True)
        return self.create_user(email, password, **extra_fields)


# === MODÈLE UTILISATEUR PERSONNALISÉ ===
class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_client = models.BooleanField(default=True)
    is_gerant = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email
# models.py
class Destination(models.Model):
    ville = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to="destinations/")
    
    def __str__(self):
        return self.ville
    def nombre_hotels(self):
        return self.etablissements.filter(type='hotel').count()

    def nombre_restaurants(self):
        return self.etablissements.filter(type='restaurant').count()


# === MODÈLE ÉTABLISSEMENT ===
class Etablissement(models.Model):
    GERANT_TYPES = [
       ('hotel', 'Hôtel'),
       ('restaurant', 'Restaurant'),
    ]
   
    gerant = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        related_name='etablissements'
    )
    nom = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    destination = models.ForeignKey(
        Destination,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='etablissements'
    )
    adresse = models.CharField(max_length=255, blank=True)
    telephone = models.CharField(max_length=20, blank=True)
    image = models.ImageField(upload_to='etablissements/principales/', blank=True, null=True)
    type = models.CharField(max_length=20, choices=GERANT_TYPES, default='hotel')
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom  



class Chambre(models.Model):
    hotel = models.ForeignKey(Etablissement, on_delete=models.CASCADE, related_name='chambres')
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    prix = models.DecimalField(max_digits=8, decimal_places=2)
    capacite = models.IntegerField()
    image = models.ImageField(upload_to='chambres/', blank=True, null=True)
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nom} - {self.hotel.nom}"

class TableRestaurant(models.Model):
    restaurant = models.ForeignKey(Etablissement, on_delete=models.CASCADE, related_name='tables')
    numero = models.CharField(max_length=20)
    capacite = models.IntegerField()
    disponible = models.BooleanField(default=True)
    image = models.ImageField(upload_to='tables/', blank=True, null=True)  # ✅

    def __str__(self):
        return f"Table {self.numero} - {self.restaurant.nom}"


class Reservation(models.Model):
    TYPE_CHOICES = [
        ('hotel', 'Hôtel'),
        ('restaurant', 'Restaurant'),
    ]

    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirmee', 'Confirmée'),
        ('annulee', 'Annulée'),
        ('terminee', 'Terminée'),
    ]

    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    etablissement = models.ForeignKey("Etablissement", on_delete=models.CASCADE)
    type_reservation = models.CharField(max_length=20, choices=TYPE_CHOICES)

    # Pour les hôtels
    chambre = models.ForeignKey("Chambre", on_delete=models.SET_NULL, null=True, blank=True)
    date_debut = models.DateTimeField(null=True, blank=True)
    date_fin = models.DateTimeField(null=True, blank=True)

    # Pour les restaurants
    table = models.ForeignKey("TableRestaurant", on_delete=models.SET_NULL, null=True, blank=True)

    # Champs communs
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    date_reservation = models.DateTimeField(auto_now_add=True)
    nb_adultes = models.PositiveIntegerField(default=1)
    nb_enfants = models.PositiveIntegerField(default=0)
    demande_speciale = models.TextField(blank=True, null=True)
    services = models.ManyToManyField("ServiceSupplementaire", blank=True)
    paiement_effectue = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.client} - {self.etablissement.nom} ({self.type_reservation})"

class Avis(models.Model):
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='avis')
    note = models.IntegerField()
    commentaire = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Avis {self.note}/5"

class Paiement(models.Model):
    utilisateur = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    reservation = models.ForeignKey("Reservation", on_delete=models.CASCADE)  # ✅ à ajouter
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date_paiement = models.DateTimeField(auto_now_add=True)
    methode = models.CharField(max_length=50)  # Ex: carte, PayPal, etc.
    statut = models.CharField(
        max_length=20,
        choices=[
            ('reussi', 'Réussi'),
            ('echoue', 'Échoué'),
            ('en_attente', 'En attente')
        ],
        default='en_attente'
    )

    def __str__(self):
        return f"{self.utilisateur.email} - {self.montant} MAD"


class EtablissementFavori(models.Model):
    utilisateur = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name="favoris")
    etablissement = models.ForeignKey(Etablissement, on_delete=models.CASCADE, related_name="favori_par")
    date_ajout = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('utilisateur', 'etablissement')

    def __str__(self):
        return f"{self.utilisateur.email} ❤️ {self.etablissement.nom}"

class Notification(models.Model):
    utilisateur = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    message = models.TextField()
    lu = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification pour {self.utilisateur.username}"

class ServiceSupplementaire(models.Model):
    etablissement = models.ForeignKey(Etablissement, on_delete=models.CASCADE, related_name="services")
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    prix = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.nom} ({self.etablissement.nom})"

class ImageEtablissement(models.Model):
    etablissement = models.ForeignKey(Etablissement, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='etablissements/images/')
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Image de {self.etablissement.nom}"

class ImageChambre(models.Model):
    chambre = models.ForeignKey(Chambre, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='chambres/images/')
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Image de {self.chambre.nom}"
    
class Avantage(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField()
    points_requis = models.PositiveIntegerField()
    image = models.ImageField(upload_to='avantages/', null=True, blank=True)
    beneficiaires = models.ManyToManyField(UserAccount, related_name="avantages_obtenus", blank=True)

    def __str__(self):
        return self.nom

class DemandeGerant(models.Model):
    GERANT_CHOICES = [
        ('hotel', 'Gérant d\'hôtel'),
        ('restaurant', 'Gérant de restaurant'),
    ]

    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    type_gerant = models.CharField(max_length=20, choices=GERANT_CHOICES)
    message = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} {self.prenom} - {self.type_gerant}"
