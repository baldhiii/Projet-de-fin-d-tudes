from django.shortcuts import render
from rest_framework import generics, permissions, viewsets
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    EtablissementSerializer,  GerantRestaurantRegisterSerializer
)
from .serializers import GerantRegisterSerializer
from .models import Menu
from .serializers import MenuSerializer
from .utils import send_confirmation_email
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers import ChambreDetailSerializer
import random
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from django.utils import timezone
from accounts.models import UserAccount
from rest_framework.decorators import api_view, permission_classes
from .models import Avantage
from django.db.models import Sum
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse
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
from rest_framework.generics import RetrieveAPIView
from .serializers import (
    ChambreSerializer,
    TableRestaurantSerializer,
    ReservationSerializer,
    AvisSerializer,
    PaiementSerializer,
    EtablissementFavoriSerializer,
    NotificationSerializer,
    ServiceSupplementaireSerializer,
    ImageEtablissementSerializer,  AvantageSerializer, DemandeGerantSerializer, ChambreDetailSerializer
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
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import redirect



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
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        destination_id = self.request.data.get("destination")
        try:
            destination = Destination.objects.get(id=destination_id)
        except Destination.DoesNotExist:
            raise serializers.ValidationError("Destination invalide.")

        etablissement = serializer.save(
            gerant=self.request.user,
            destination=destination
        )

        # Ajout automatique de l’image principale
        if etablissement.image:
            ImageEtablissement.objects.create(
                etablissement=etablissement,
                image=etablissement.image,
                description="Image principale ajoutée automatiquement"
            )

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
        restaurant_id = self.request.data.get("restaurant")

        # Vérifie que le restaurant existe et appartient au gérant connecté
        try:
            restaurant = Etablissement.objects.get(
                id=restaurant_id,
                gerant=self.request.user,
                type="restaurant"
            )
        except Etablissement.DoesNotExist:
            raise serializers.ValidationError("Restaurant non trouvé ou non autorisé.")

        # Sauvegarde de la table avec l’instance du restaurant
        serializer.save(restaurant=restaurant)



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

    @action(detail=True, methods=["patch"])
    def changer_statut(self, request, pk=None):
        try:
            reservation = self.get_object()
            if reservation.etablissement.gerant != request.user:
                return Response({"detail": "Action non autorisée."}, status=403)

            nouveau_statut = request.data.get("statut")
            if nouveau_statut not in ["confirmee", "annulee"]:
                return Response({"detail": "Statut invalide."}, status=400)

            reservation.statut = nouveau_statut
            reservation.save()
            return Response({"message": f"Réservation mise à jour vers '{nouveau_statut}'."})
        except Reservation.DoesNotExist:
            return Response({"detail": "Réservation introuvable."}, status=404)



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
        nb_avis = Avis.objects.filter(client=user).count()

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
@permission_classes([AllowAny])  # accès public autorisé
def tables_par_etablissement(request, id):
    try:
        etablissement = Etablissement.objects.get(id=id, type='restaurant')
    except Etablissement.DoesNotExist:
        return Response({"detail": "Restaurant introuvable."}, status=status.HTTP_404_NOT_FOUND)

    tables = TableRestaurant.objects.filter(
        restaurant=etablissement,
        disponible=True
    )
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
    
stripe.api_key = settings.STRIPE_SECRET_KEY

class CheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        reservation_id = request.data.get("reservation_id")

        try:
            reservation = Reservation.objects.get(id=reservation_id, client=request.user)
        except Reservation.DoesNotExist:
            return Response({"error": "Réservation introuvable"}, status=404)

        montant = 50000  # 💰 En centimes : 500 MAD = 50000

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                'price_data': {
                    'currency': 'mad',
                    'product_data': {
                        'name': f"Réservation {reservation.etablissement.nom}",
                    },
                    'unit_amount': montant,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url = settings.DOMAIN_FRONTEND + "/payement-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=settings.DOMAIN_FRONTEND + "/cancel",
            metadata={
                "reservation_id": str(reservation.id),
                "user_id": str(request.user.id)
            }
        )

        return Response({
            "sessionId": session.id,
            "stripe_public_key": settings.STRIPE_PUBLISHABLE_KEY
        })

class StripeWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    @method_decorator(csrf_exempt)
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        endpoint_secret = "whsec_d6dd1098983412fcba27e8d0a30f1c5e17ec0e4daca01ad2b35a590e61955eb6"

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except (ValueError, stripe.error.SignatureVerificationError):
            return HttpResponse(status=400)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            reservation_id = session['metadata']['reservation_id']
            user_id = session['metadata']['user_id']

            try:
                reservation = Reservation.objects.get(id=reservation_id)
                reservation.paiement_effectue = True
                reservation.statut = "confirmee"  # ✅ CHANGEMENT DE STATUT
                reservation.save()

                # ✅ Rendre indisponible la chambre ou table selon le type de réservation
                if reservation.chambre:
                    reservation.chambre.disponible = False
                    reservation.chambre.save()
                elif reservation.table:
                    reservation.table.disponible = False
                    reservation.table.save()

                # ✅ Enregistrer le paiement
                Paiement.objects.create(
                    utilisateur_id=user_id,
                    reservation=reservation,
                    montant=session["amount_total"] / 100,
                    methode="Stripe",
                    statut="reussi"
                )
                
                if reservation.chambre:
                    date_debut = reservation.date_debut
                    date_fin = reservation.date_fin
                elif reservation.table:
                    date_debut = reservation.date_debut
                    date_fin = reservation.date_fin

                print("📨 Envoi de l’email à :", reservation.client.email)

                send_confirmation_email(
    user_email=reservation.client.email,
    client_name=f"{reservation.client.first_name} {reservation.client.last_name}",
    etablissement=reservation.etablissement.nom,
    date_debut=date_debut,
    date_fin=date_fin,
    montant=session["amount_total"] / 100,
    reference=f"RES{reservation.id:06d}",
    type_reservation=reservation.type_reservation
)


            except Reservation.DoesNotExist:
                pass

        return HttpResponse(status=200)

    
class PreReservationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("📥 Données reçues :", request.data)  # ← Ajoute cette ligne temporairement

        serializer = ReservationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            reservation = serializer.save()
            return Response({"reservation_id": reservation.id}, status=201)
        print("❌ Erreurs de validation :", serializer.errors)  # ← Ajoute aussi celle-ci
        return Response(serializer.errors, status=400)

class StripePaymentConfirmView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session_id = request.data.get("session_id")
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            return Response({"status": session.payment_status})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class GerantDashboardOverview(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        etablissements = user.etablissements.filter(type="hotel")

        # Paiements du jour
        today = timezone.now().date()
        paiements = Paiement.objects.filter(
    reservation__etablissement__in=etablissements,
    date_paiement__date=today,
    statut="reussi"
)

        revenu_journalier = paiements.aggregate(total=Sum("montant"))["total"] or 0

        # Clients actuels (réservations en cours)
        now = timezone.now()
        clients_actuels = Reservation.objects.filter(
            etablissement__in=etablissements,
            date_debut__lte=now,
            date_fin__gte=now,
            statut="confirmee"
        ).count()

        # Revenu moyen par chambre
        chambres = Chambre.objects.filter(hotel__in=etablissements)
        total_chambres = chambres.count()
        total_paiements = Paiement.objects.filter(utilisateur=user, statut="reussi").aggregate(
            total=Sum("montant")
        )["total"] or 0
        revenu_par_chambre = round(total_paiements / total_chambres, 2) if total_chambres > 0 else 0

        # Occupation globale
        occupees = Reservation.objects.filter(
            chambre__in=chambres,
            date_debut__lte=now,
            date_fin__gte=now,
            statut="confirmee"
        ).count()

        occupation_data = [{
            "type": "Toutes chambres",
            "total": total_chambres,
            "occupees": occupees,
            "en_nettoyage": 2,    # valeur statique (optionnel : à rendre dynamique plus tard)
            "maintenance": 1
        }]

        return Response({
            "revenu_journalier": revenu_journalier,
            "clients_actuels": clients_actuels,
            "revenu_par_chambre": revenu_par_chambre,
            "occupation_chambres": occupation_data
        })
    
class DernieresReservationsGerantView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        reservations = Reservation.objects.filter(etablissement__gerant=user).order_by('-date_reservation')[:5]

        data = []
        for r in reservations:
            data.append({
                "client": r.client.email,
                "date_debut": r.date_debut,
                "date_fin": r.date_fin,
                "montant": None,  # facultatif, à adapter plus tard
                "statut": r.statut,
            })

        return Response(data)
    
class ReservationsGerantView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        reservations = Reservation.objects.filter(
            etablissement__gerant=user,
            type_reservation='hotel'  # ✅ Affiche uniquement les hôtels
        ).order_by('-date_reservation')

        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
    
class ChambreViewSet(viewsets.ModelViewSet):
    queryset = Chambre.objects.all()
    serializer_class = ChambreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Le gérant ne voit que les chambres de ses propres hôtels.
        """
        user = self.request.user
        return Chambre.objects.filter(hotel__gerant=user)

    def perform_create(self, serializer):
        """
        À la création, on transforme l’ID envoyé en instance d’Etablissement.
        """
        etab_id = self.request.data.get("hotel")
        try:
            etablissement = Etablissement.objects.get(id=etab_id, gerant=self.request.user)
            serializer.save(hotel=etablissement)
        except Etablissement.DoesNotExist:
            raise serializers.ValidationError("Établissement introuvable ou non autorisé.")
        
class GerantRestaurantDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        restaurants = Etablissement.objects.filter(gerant=user, type="restaurant")

        if not restaurants.exists():
            return Response({
                "revenu_journalier": 0,
                "revenu_total": 0,
                "clients_actuels": 0,
                "revenu_par_table": 0
            })

        # Paiements
        today = timezone.now().date()
        paiements_jour = Paiement.objects.filter(
            reservation__etablissement__in=restaurants,
            statut="reussi"
        )
        revenu_journalier = paiements_jour.filter(date_paiement__date=today).aggregate(
            total=Sum("montant"))["total"] or 0

        revenu_total = paiements_jour.aggregate(total=Sum("montant"))["total"] or 0

        # Réservations confirmées
        clients_actuels = Reservation.objects.filter(
            etablissement__in=restaurants,
            statut="confirmee"
        ).count()

        # Tables
        nb_tables = TableRestaurant.objects.filter(restaurant__in=restaurants).count()
        revenu_par_table = round(revenu_total / nb_tables, 2) if nb_tables > 0 else 0

        return Response({
            "revenu_journalier": revenu_journalier,
            "revenu_total": revenu_total,
            "clients_actuels": clients_actuels,
            "revenu_par_table": revenu_par_table
        })
class ReservationsRestaurantGerantView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        reservations = Reservation.objects.filter(
            etablissement__gerant=user,
            type_reservation='restaurant'  # ✅ Seulement les restaurants
        ).order_by('-date_reservation')

        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
    
class HotelsDuGerantAPIView(ListAPIView):
    serializer_class = EtablissementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Etablissement.objects.filter(
            gerant=self.request.user,
            type="hotel"
        )
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tables_du_restaurant(request, id):
    try:
        restaurant = Etablissement.objects.get(id=id, gerant=request.user, type="restaurant")
    except Etablissement.DoesNotExist:
        return Response({"detail": "Restaurant introuvable ou non autorisé."}, status=404)

    tables = TableRestaurant.objects.filter(restaurant=restaurant)
    serializer = TableRestaurantSerializer(tables, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def hotels_aleatoires(request):
    hotels = list(Etablissement.objects.filter(type='hotel'))
    random.shuffle(hotels)
    selection = hotels[:4]
    serializer = EtablissementSerializer(selection, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def restaurants_aleatoires(request):
    restaurants = Etablissement.objects.filter(type="restaurant")
    selection = random.sample(list(restaurants), min(3, len(restaurants)))  # max 3 restaurants
    serializer = EtablissementSerializer(selection, many=True, context={"request": request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def etablissements_recents(request):
    etablissements = Etablissement.objects.order_by('-date_creation')[:6]
    serializer = EtablissementSerializer(etablissements, many=True, context={'request': request})
    return Response(serializer.data)

class DemandeGerantAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = DemandeGerantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Demande envoyée avec succès."}, status=201)
        return Response(serializer.errors, status=400)

class ChambreUpdateAPIView(RetrieveUpdateAPIView):
    queryset = Chambre.objects.all()
    serializer_class = ChambreDetailSerializer

class ChambreDetailAPIView(RetrieveUpdateAPIView):  # ✅ au lieu de RetrieveAPIView
    queryset = Chambre.objects.all()
    serializer_class = ChambreDetailSerializer
    permission_classes = [IsAuthenticated]


class ImageChambreCreateAPIView(generics.CreateAPIView):
    queryset = ImageChambre.objects.all()
    serializer_class = ImageChambreSerializer

    def post(self, request, *args, **kwargs):
        print("✅ Données reçues dans la requête :")
        print(request.data)

        return super().post(request, *args, **kwargs)
    
class TableDetailAPIView(RetrieveAPIView):
    queryset = TableRestaurant.objects.all()
    serializer_class = TableRestaurantSerializer
    lookup_field = 'id'

class TableUpdateAPIView(RetrieveUpdateAPIView):
    queryset = TableRestaurant.objects.all()
    serializer_class = TableRestaurantSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

class ActivateUserView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = UserAccount.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserAccount.DoesNotExist):
            user = None

        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            # Rediriger vers le login du frontend (modifie l'URL selon ton projet)
            return redirect("http://localhost:5173/login?activated=true")
        else:
            return redirect("http://localhost:5173/login?error=invalid-link")
        

@api_view(['GET'])
@permission_classes([AllowAny])
def menu_par_restaurant(request, id):
    plats = Menu.objects.filter(restaurant__id=id)
    serializer = MenuSerializer(plats, many=True)
    return Response(serializer.data)
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

class MenuGerantViewSet(viewsets.ModelViewSet):
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]  # ✅ accepte tous les formats

    def get_queryset(self):
        return Menu.objects.filter(restaurant__gerant=self.request.user)

    def perform_create(self, serializer):
        restaurant = serializer.validated_data.get('restaurant')
        if restaurant.gerant != self.request.user:
            raise permissions.PermissionDenied("Restaurant non autorisé.")
        serializer.save()

    def perform_update(self, serializer):
        restaurant = serializer.validated_data.get('restaurant')

    # ✅ Si aucun restaurant n'est envoyé (modif partielle), on récupère depuis l'objet instance
        if restaurant is None:
           restaurant = serializer.instance.restaurant

        if restaurant.gerant != self.request.user:
            raise permissions.PermissionDenied("Vous ne pouvez modifier ce plat.")

        serializer.save()

from datetime import datetime

@api_view(['GET'])
def recherche_etablissements(request):
    ville = request.GET.get("ville")
    type_etab = request.GET.get("type")
    date_debut = request.GET.get("date_debut")
    date_fin = request.GET.get("date_fin")

    etablissements = Etablissement.objects.filter(destination__icontains=ville, type=type_etab)

    if date_debut and date_fin:
        date_debut = datetime.fromisoformat(date_debut)
        date_fin = datetime.fromisoformat(date_fin)

        # Exclure les établissements ayant des réservations actives pour cette période
        etablissements = etablissements.exclude(
            Q(reservation__date_debut__lt=date_fin) &
            Q(reservation__date_fin__gt=date_debut) &
            Q(reservation__statut="confirmee")
        ).distinct()

    serializer = EtablissementSerializer(etablissements, many=True)
    return Response(serializer.data)

class ImageChambreUpdateAPIView(generics.UpdateAPIView):
    queryset = ImageChambre.objects.all()
    serializer_class = ImageChambreSerializer

class AvisListeGlobaleAPIView(generics.ListAPIView):
    queryset = Avis.objects.select_related("client").order_by("-date")[:10]  # ✅ champ "date"
    serializer_class = AvisSerializer
    permission_classes = [AllowAny]
    
class AvisCreateAPIView(generics.CreateAPIView):
    serializer_class = AvisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        client = request.user
        etablissement_id = request.data.get("etablissement")

        if not etablissement_id:
            return Response({"detail": "Établissement requis."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Vérifie que le client a une réservation terminée
        reservation_existe = Reservation.objects.filter(
            client=client,
            etablissement_id=etablissement_id,
            statut="terminee"
        ).exists()

        if not reservation_existe:
            return Response(
                {"detail": "Vous devez avoir terminé un séjour pour laisser un avis."},
                status=status.HTTP_403_FORBIDDEN
            )

        # ✅ Vérifie que le client n’a pas déjà laissé un avis
        avis_existe = Avis.objects.filter(
            client=client,
            etablissement_id=etablissement_id
        ).exists()

        if avis_existe:
            return Response(
                {"detail": "Vous avez déjà laissé un avis pour cet établissement."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Valide les données restantes et crée l'avis
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def peut_laisser_avis(request, etablissement_id):
    client = request.user

    reservation_existe = Reservation.objects.filter(
        client=client,
        etablissement_id=etablissement_id,
        statut="terminee"
    ).exists()

    avis_existe = Avis.objects.filter(
        client=client,
        etablissement_id=etablissement_id
    ).exists()

    return Response({"peut_laisser": reservation_existe and not avis_existe})

from rest_framework.permissions import AllowAny

class RegisterGerantView(APIView):
    permission_classes = [AllowAny]  # ✅ rend la vue publique

    def post(self, request):
        serializer = GerantRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Gérant créé avec succès"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterGerantRestaurantView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GerantRestaurantRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Gérant restaurant créé avec succès"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RestaurantsDuGerantAPIView(ListAPIView):
    serializer_class = EtablissementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Etablissement.objects.filter(
            gerant=self.request.user,
            type="restaurant"
        )