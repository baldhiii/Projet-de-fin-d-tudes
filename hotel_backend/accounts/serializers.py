from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import UserAccount, Etablissement
from .models import TableRestaurant
from djoser.serializers import ActivationSerializer
from django.contrib.auth import get_user_model
from .models import (
    UserAccount,
    Etablissement,
    Chambre,
    TableRestaurant,
    Reservation,
    Avis,
    Paiement,
    EtablissementFavori,
    Notification,
    ServiceSupplementaire,
    ImageEtablissement,
    Destination,  DemandeGerant
)
from .models import ImageChambre, ServiceSupplementaire, Avantage, Menu
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site



# ===Pour notre Serializer pour l'inscription ===
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = UserAccount
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = UserAccount.objects.create_user(**validated_data)
        user.is_active = False  # du genre le Compte inactif tant que non confirmé par email pour la securité
        user.save()

        # Pour la Génération token d’activation essentiel pour notre auth
        request = self.context.get('request')
        current_site = get_current_site(request)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activation_link = f"http://{current_site.domain}/activation/{uid}/{token}/"

        # Pour envoi de l’email
        send_mail(
            subject="Activez votre compte",
            message=f"Bienvenue {user.first_name}, cliquez sur le lien suivant pour activer votre compte : {activation_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return user


# === Serializer utilisateur connecté (profil) ===
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'profile_picture']
        read_only_fields = ['id', 'username', 'profile_picture']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance


# === Serializer pour login (JWT) ===
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data.get('email'), password=data.get('password'))
        if not user:
            raise serializers.ValidationError("Email ou mot de passe incorrect.")
        if not user.is_active:
            raise serializers.ValidationError("Ce compte est désactivé.")
        return {'user': user}


# === Serializer pour établissements ===
class EtablissementSerializer(serializers.ModelSerializer):
    destination = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all()
    )

    class Meta:
        model = Etablissement
        fields = '__all__'
        read_only_fields = ['gerant', 'date_creation']


class ChambreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chambre
        fields = '__all__'
        read_only_fields = ['hotel']

class TableRestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableRestaurant
        fields = '__all__'
        read_only_fields = ['restaurant']

from accounts.serializers import UserSerializer, EtablissementSerializer, TableRestaurantSerializer

class ReservationSerializer(serializers.ModelSerializer):
    etablissement = EtablissementSerializer(read_only=True)
    table = TableRestaurantSerializer(read_only=True)
    services = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ServiceSupplementaire.objects.all(),
        required=False
    )

    chambre = serializers.PrimaryKeyRelatedField(
        queryset=Chambre.objects.all(),
        required=False
    )

    table = serializers.PrimaryKeyRelatedField(
        queryset=TableRestaurant.objects.all(),
        required=False
    )

    etablissement = serializers.PrimaryKeyRelatedField(
        queryset=Etablissement.objects.all(),
        required=False  
    )

    client = UserSerializer(read_only=True)  

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['id', 'client', 'date_reservation']

    def validate(self, data):
        """
        Valide selon le type_reservation.
        Supporte PATCH (self.instance) + POST (data).
        """
        type_reservation = data.get(
            'type_reservation',
            getattr(self.instance, 'type_reservation', None)
        )

        if type_reservation == 'hotel':
            chambre = data.get('chambre', getattr(self.instance, 'chambre', None))
            date_debut = data.get('date_debut', getattr(self.instance, 'date_debut', None))
            date_fin = data.get('date_fin', getattr(self.instance, 'date_fin', None))

            if not chambre:
                raise serializers.ValidationError("Chambre requise pour une réservation d'hôtel.")
            if not date_debut or not date_fin:
                raise serializers.ValidationError("Dates requises pour une réservation d'hôtel.")

        elif type_reservation == 'restaurant':
            table = data.get('table', getattr(self.instance, 'table', None))
            if not table:
                raise serializers.ValidationError("Table requise pour une réservation de restaurant.")
        else:
            raise serializers.ValidationError("Type de réservation invalide ou manquant.")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        services = validated_data.pop('services', [])

        # sa ciest pour ne pas écraser si admin crée la réservation manuellement
        client = request.user if request and request.user.is_authenticated else None
        reservation = Reservation.objects.create(client=client, **validated_data)
        reservation.services.set(services)
        return reservation



class AvisSerializer(serializers.ModelSerializer):
    client_prenom = serializers.SerializerMethodField()
    client_nom = serializers.SerializerMethodField()
    client_photo = serializers.SerializerMethodField()

    class Meta:
        model = Avis
        fields = ['id', 'note', 'commentaire', 'date', 'etablissement', 'client_prenom', 'client_nom', 'client_photo']

    def get_client_prenom(self, obj):
        return obj.client.first_name if obj.client else "Anonyme"

    def get_client_nom(self, obj):
        return obj.client.last_name if obj.client else ""

    def get_client_photo(self, obj):
        if obj.client and obj.client.profile_picture:
            return obj.client.profile_picture
        return "https://randomuser.me/api/portraits/lego/1.jpg"

class PaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = '__all__'
        read_only_fields = ['utilisateur', 'date_paiement']

class EtablissementFavoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtablissementFavori
        fields = '__all__'
        read_only_fields = ['date_ajout']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['date_creation']

class ServiceSupplementaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSupplementaire
        fields = '__all__'
        read_only_fields = ['etablissement']

class ImageEtablissementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageEtablissement
        fields = '__all__'
        read_only_fields = ['id', 'etablissement']


class DestinationMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['id', 'ville']

class EtablissementSerializer(serializers.ModelSerializer):
    images = ImageEtablissementSerializer(many=True, read_only=True)
    destination = DestinationMiniSerializer(read_only=True)

    class Meta:
        model = Etablissement
        fields = '__all__'

class DestinationSerializer(serializers.ModelSerializer):
    nombre_hotels = serializers.SerializerMethodField()
    nombre_restaurants = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ["id", "ville", "image", "nombre_hotels", "nombre_restaurants"]

    def get_nombre_hotels(self, obj):
        return obj.etablissements.filter(type="hotel").count()

    def get_nombre_restaurants(self, obj):
        return obj.etablissements.filter(type="restaurant").count()

class ImageChambreSerializer(serializers.ModelSerializer):
    chambre = serializers.PrimaryKeyRelatedField(queryset=Chambre.objects.all())  

    class Meta:
        model = ImageChambre
        fields = '__all__'

class ChambreDetailSerializer(serializers.ModelSerializer):
    images = ImageChambreSerializer(many=True, read_only=True)
    hotel = serializers.IntegerField(source='hotel.id', read_only=True)  
    services = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ServiceSupplementaire.objects.all()
    )  
    superficie = serializers.IntegerField(required=False) 


    class Meta:
        model = Chambre
        fields = [
            "id", "nom", "description", "prix", "capacite", "disponible", "image", "hotel", "images", "services", "superficie"
        ]


class AvantageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avantage
        fields = '__all__'



class TableRestaurantSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = TableRestaurant
        fields = '__all__'
        read_only_fields = ['restaurant']

class ServiceSupplementaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSupplementaire
        fields = '__all__'

class DemandeGerantSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandeGerant
        fields = '__all__'

User = get_user_model()

class MenuSerializer(serializers.ModelSerializer):
    restaurant = serializers.PrimaryKeyRelatedField(
        queryset=Etablissement.objects.filter(type='restaurant')
    )
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Menu
        fields = '__all__'

class GerantRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = UserAccount
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password2', 'matricule', 'date_embauche', 'type_gerant']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = UserAccount.objects.create(
            **validated_data,
            is_active=True,
            is_gerant=True,
            is_client=False
        )
        user.set_password(password)
        user.save()
        return user

class GerantRestaurantRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserAccount
        fields = ['email', 'username', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = UserAccount.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            is_gerant=True,
            is_client=False,
        )
        user.type_gerant = 'restaurant'  
        user.is_active = True  
        user.save()
        return user
    
class ReservationRestaurantGerantSerializer(serializers.ModelSerializer):
    client = serializers.SerializerMethodField()
    etablissement = serializers.SerializerMethodField()
    table = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id',
            'client',
            'etablissement',
            'table',
            'date_debut',
            'statut'
        ]

    def get_client(self, obj):
        return {
            "id": obj.client.id,
            "first_name": obj.client.first_name,
            "last_name": obj.client.last_name
        }

    def get_etablissement(self, obj):
        if obj.etablissement:
            return {
                "id": obj.etablissement.id,
                "nom": obj.etablissement.nom
            }
        return {"nom": "Non défini"}

    def get_table(self, obj):
        if obj.table:
            return {
                "id": obj.table.id,
                "numero": obj.table.numero,
                "capacite": obj.table.capacite
            }
        return {"numero": "N/A", "capacite": "-"}

    
class ReservationGerantSerializer(serializers.ModelSerializer):
    client = serializers.SerializerMethodField()
    etablissement = serializers.SerializerMethodField()
    chambre = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id', 'client', 'etablissement', 'chambre',
            'date_debut', 'date_fin', 'statut'
        ]

    def get_client(self, obj):
        return {
            "id": obj.client.id,
            "first_name": obj.client.first_name,
            "last_name": obj.client.last_name,
        }

    def get_etablissement(self, obj):
        if obj.etablissement:
            return {
                "id": obj.etablissement.id,
                "nom": obj.etablissement.nom,
            }
        return None

    def get_chambre(self, obj):
        if obj.chambre:
            return {
                "id": obj.chambre.id,
                "nom": obj.chambre.nom,
            }
        return None
