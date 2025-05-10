from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import UserAccount, Etablissement
from .models import TableRestaurant

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
    Destination,
)
from .models import ImageChambre, ServiceSupplementaire, Avantage


# === Serializer pour l'inscription ===
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

class ReservationSerializer(serializers.ModelSerializer):
    services = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ServiceSupplementaire.objects.all(),
        required=False
    )

    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['id', 'client', 'date_reservation', 'statut']

    def validate(self, data):
        type_reservation = data.get('type_reservation')

        if type_reservation == 'hotel':
            if not data.get('chambre'):
                raise serializers.ValidationError("La chambre est requise pour une réservation d'hôtel.")
            if not data.get('date_debut') or not data.get('date_fin'):
                raise serializers.ValidationError("Les dates de début et de fin sont requises pour un hôtel.")
        elif type_reservation == 'restaurant':
            if not data.get('table'):
                raise serializers.ValidationError("La table est requise pour une réservation de restaurant.")
        else:
            raise serializers.ValidationError("Type de réservation invalide.")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        services = validated_data.pop('services', [])
        reservation = Reservation.objects.create(client=request.user, **validated_data)
        reservation.services.set(services)
        return reservation
    
class AvisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avis
        fields = '__all__'
        read_only_fields = ['date']

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

class ImageEtablissementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageEtablissement
        fields = ['id', 'image', 'description']


class EtablissementSerializer(serializers.ModelSerializer):
    images = ImageEtablissementSerializer(many=True, read_only=True)

    class Meta:
        model = Etablissement
        fields = '__all__'
# serializers.py
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
    class Meta:
        model = ImageChambre
        fields = '__all__'

class AvantageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avantage
        fields = '__all__'

class TableRestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableRestaurant
        fields = '__all__'

class ServiceSupplementaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceSupplementaire
        fields = '__all__'
