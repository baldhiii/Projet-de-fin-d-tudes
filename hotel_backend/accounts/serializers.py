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
    Destination,  DemandeGerant
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
        required=False  # ⚠️ pour permettre update / patch sans crash
    )

    client = UserSerializer(read_only=True)  # lecture seule
    # 👆 utile si admin veut voir qui a réservé

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

        # ⚠️ pour ne pas écraser si admin crée la réservation manuellement
        client = request.user if request and request.user.is_authenticated else None
        reservation = Reservation.objects.create(client=client, **validated_data)
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
