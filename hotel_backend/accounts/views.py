from django.shortcuts import render
from rest_framework import generics, permissions, viewsets
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    EtablissementSerializer
)
from rest_framework.decorators import api_view, permission_classes
from .models import Avantage
from django.db.models import Sum


from .models import UserAccount, Etablissement
from .models import (
    Chambre,
    TableRestaurant,
    Reservation,
    Avis,
    Paiement,
    EtablissementFavori,
    Notification,
    ServiceSupplementaire,
    ImageEtablissement,
)
from rest_framework import status
from rest_framework.decorators import api_view

from .serializers import (
    ChambreSerializer,
    TableRestaurantSerializer,
    ReservationSerializer,
    AvisSerializer,
    PaiementSerializer,
    EtablissementFavoriSerializer,
    NotificationSerializer,
    ServiceSupplementaireSerializer,
    ImageEtablissementSerializer,  AvantageSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Destination
from .serializers import DestinationSerializer
from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView
from .models import ImageChambre
from .serializers import ImageChambreSerializer



# === Inscription utilisateur ===
class RegisterView(generics.CreateAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# === Récupération du profil utilisateur connecté ===
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# === Mise à jour du profil utilisateur ===
class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# === CRUD pour les établissements (gérant uniquement) ===
# === CRUD pour les établissements (gérant uniquement) ===
class EtablissementViewSet(viewsets.ModelViewSet):
    queryset = Etablissement.objects.all()
    serializer_class = EtablissementSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # 👈 accès public pour liste et détails
        return [IsAuthenticated()]  # 👈 accès privé pour ajout/modif/suppression

    def perform_create(self, serializer):
        etablissement = serializer.save(gerant=self.request.user)

        # Ajout automatique de l'image principale
        if etablissement.image:
            ImageEtablissement.objects.create(
                etablissement=etablissement,
                image=etablissement.image,
                description="Image principale ajoutée automatiquement"
            )

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, "is_gerant", False):
            return Etablissement.objects.filter(gerant=user)
        return Etablissement.objects.all()

# === CRUD pour les chambres (gérant uniquement) ===
class ChambreViewSet(viewsets.ModelViewSet):
    serializer_class = ChambreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Chambre.objects.filter(hotel__gerant=self.request.user)

    def perform_create(self, serializer):
        serializer.save(hotel=self.request.data.get("hotel"))


# === Tables de restaurant ===
class TableRestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = TableRestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TableRestaurant.objects.filter(restaurant__gerant=self.request.user)

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.data.get("restaurant"))


# === Réservations ===
class ReservationViewSet(viewsets.ModelViewSet):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_gerant:
            return Reservation.objects.filter(etablissement__gerant=user)
        return Reservation.objects.filter(client=user)

    def perform_create(self, serializer):
        services = self.request.data.get("services", [])
        instance = serializer.save()  # Ne pas passer `client` ici
        instance.client = self.request.user
        instance.save()
        if services:
            instance.services.set(services)



# === Avis (client) ===
class AvisViewSet(viewsets.ModelViewSet):
    queryset = Avis.objects.all()
    serializer_class = AvisSerializer
    permission_classes = [permissions.IsAuthenticated]


# === Paiements (client uniquement) ===
class PaiementViewSet(viewsets.ModelViewSet):
    serializer_class = PaiementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Paiement.objects.filter(utilisateur=self.request.user)

    def perform_create(self, serializer):
        serializer.save(utilisateur=self.request.user)


# === Favoris (client uniquement) ===
class EtablissementFavoriViewSet(viewsets.ModelViewSet):
    serializer_class = EtablissementFavoriSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EtablissementFavori.objects.filter(utilisateur=self.request.user)

    def perform_create(self, serializer):
        serializer.save(utilisateur=self.request.user)


# === Notifications ===
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(utilisateur=self.request.user)


# === Services supplémentaires (gérant) ===
class ServiceSupplementaireViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSupplementaireSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ServiceSupplementaire.objects.filter(etablissement__gerant=self.request.user)


# === Images de l’établissement ===
class ImageEtablissementViewSet(viewsets.ModelViewSet):
    serializer_class = ImageEtablissementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ImageEtablissement.objects.filter(etablissement__gerant=self.request.user)

    def perform_create(self, serializer):
        etablissement_id = self.request.data.get("etablissement")
        try:
            etablissement = Etablissement.objects.get(id=etablissement_id, gerant=self.request.user)
        except Etablissement.DoesNotExist:
            raise serializers.ValidationError("Établissement non trouvé ou non autorisé.")

        # ✅ Limite de 8 images par établissement
        if ImageEtablissement.objects.filter(etablissement=etablissement).count() >= 8:
            raise serializers.ValidationError("Vous avez atteint la limite de 8 images pour cet établissement.")

        serializer.save(etablissement=etablissement)
    
# === Vues publiques (clients non connectés) ===
class HotelsPublicListView(generics.ListAPIView):
    serializer_class = EtablissementSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Etablissement.objects.filter(type='hotel')

class RestaurantsPublicListView(generics.ListAPIView):
    serializer_class = EtablissementSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Etablissement.objects.filter(type='restaurant')


class EtablissementsParVilleAPIView(ListAPIView):
    serializer_class = EtablissementSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        ville = self.kwargs.get('ville')
        return Etablissement.objects.filter(destination__ville__iexact=ville)
    
class DestinationStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        villes = Etablissement.objects.values_list('ville', flat=True).distinct()
        results = []

        for ville in villes:
            hotels = Etablissement.objects.filter(type='hotel', ville=ville).count()
            restaurants = Etablissement.objects.filter(type='restaurant', ville=ville).count()

            # On pourrait personnaliser les images plus tard selon la ville
            results.append({
                "ville": ville,
                "nombre_hotels": hotels,
                "nombre_restaurants": restaurants,
                "image": f"https://source.unsplash.com/featured/?{ville},morocco"
            })

        return Response(results)
  
class DestinationListAPIView(generics.ListAPIView):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
def chambres_par_etablissement(request, id):
    chambres = Chambre.objects.filter(hotel=id)  # ✅ adapte ici
    serializer = ChambreSerializer(chambres, many=True)
    return Response(serializer.data)
@api_view(['GET'])
def images_par_etablissement(request, id):
    images = ImageEtablissement.objects.filter(etablissement_id=id)
    serializer = ImageEtablissementSerializer(images, many=True, context={'request': request})
    return Response(serializer.data)  

@api_view(['GET'])
def images_par_chambre(request, id):
    images = ImageChambre.objects.filter(chambre_id=id)
    serializer = ImageChambreSerializer(images, many=True)
    return Response(serializer.data)

class MesReservationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reservations = Reservation.objects.filter(client=request.user).order_by('-date_reservation')
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
   
class ActivitesRecentesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reservations = Reservation.objects.filter(client=request.user).order_by('-date_reservation')[:5]
        data = [
            {
                "etablissement": r.etablissement.nom if r.etablissement else "N/A",
                "statut": r.statut,
                "date": r.date_reservation
            }
            for r in reservations
        ]
        return Response(data)

class AvantagesClientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        avantages = Avantage.objects.filter(beneficiaires=request.user)
        serializer = AvantageSerializer(avantages, many=True)
        return Response(serializer.data)
    
class StatsClientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # 🔢 Statistiques sur les réservations
        reservations = Reservation.objects.filter(client=user)
        total_reservations = reservations.count()
        reservations_hotel = reservations.filter(type_reservation="hotel").count()
        reservations_restaurant = reservations.filter(type_reservation="restaurant").count()
        reservations_confirmees = reservations.filter(statut="confirmee").count()
        reservations_annulees = reservations.filter(statut="annulee").count()

        # 💰 Total des dépenses réussies
        total_depenses = Paiement.objects.filter(
            utilisateur=user,
            statut="reussi"
        ).aggregate(total=Sum("montant"))["total"] or 0

        # 🗣️ Nombre d'avis publiés
        nb_avis = Avis.objects.filter(reservation__client=user).count()

        # 🎁 Calcul des points fidélité (1 MAD = 10 points)
        points_fidelite = int(total_depenses * 10)

        # 🏅 Définir le statut en fonction des points
        if points_fidelite >= 2000:
            statut = "Platinum"
        elif points_fidelite >= 1000:
            statut = "Gold"
        elif points_fidelite >= 500:
            statut = "Silver"
        else:
            statut = "Bronze"

        # 🔄 Réponse complète
        return Response({
            "total_reservations": total_reservations,
            "reservations_hotel": reservations_hotel,
            "reservations_restaurant": reservations_restaurant,
            "reservations_confirmees": reservations_confirmees,
            "reservations_annulees": reservations_annulees,
            "total_depenses": total_depenses,
            "nb_avis": nb_avis,
            "points_fidelite": points_fidelite,
            "statut": statut,
        })
    

@api_view(['GET'])
@permission_classes([AllowAny])  # ✅ accès public pour les clients
def tables_par_etablissement(request, id):
    tables = TableRestaurant.objects.filter(restaurant_id=id, disponible=True)  # ✅ seulement les dispo
    serializer = TableRestaurantSerializer(tables, many=True, context={'request': request})
    return Response(serializer.data) 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def services_par_etablissement(request, id):
    try:
        etab = Etablissement.objects.get(id=id)
        services = ServiceSupplementaire.objects.filter(etablissement=etab)
        serializer = ServiceSupplementaireSerializer(services, many=True)
        return Response(serializer.data)
    except Etablissement.DoesNotExist:
        return Response({"detail": "Établissement introuvable."}, status=404)
