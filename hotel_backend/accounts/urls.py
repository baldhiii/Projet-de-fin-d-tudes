from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, ProfileView, ProfileUpdateView, EtablissementViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import HotelsPublicListView, RestaurantsPublicListView
from .views import DestinationListAPIView, EtablissementsParVilleAPIView, DestinationStatsView, ReservationViewSet
from .views import chambres_par_etablissement, images_par_etablissement
from .views import StatsClientView
from .views import tables_par_etablissement
from .views import services_par_etablissement


from .views import (
    MesReservationsView,
    ActivitesRecentesView,
    AvantagesClientView
)

router = DefaultRouter()
router.register(r'etablissements', EtablissementViewSet, basename='etablissements')
router.register(r'reservations', ReservationViewSet, basename='reservations')

urlpatterns = [
    path('registration/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('hotels/', HotelsPublicListView.as_view(), name='hotels-public'),
    path('restaurants/', RestaurantsPublicListView.as_view(), name='restaurants-public'),
    path('etablissements/<int:id>/tables/', tables_par_etablissement, name='tables-par-etablissement'),
    path('etablissements/<int:id>/chambres/', chambres_par_etablissement, name='chambres_par_etablissement'),
    path('etablissements/<int:id>/images/', images_par_etablissement, name='images_par_etablissement'),
    path('etablissements/<int:id>/services/', services_par_etablissement, name='services-par-etablissement'),

    path('dashboard/mes-reservations/', MesReservationsView.as_view(), name='mes-reservations'),
    path('dashboard/activites-recentes/', ActivitesRecentesView.as_view(), name='activites-recentes'),
    path('dashboard/avantages/', AvantagesClientView.as_view(), name='avantages-client'),
    path('dashboard/stats-client/', StatsClientView.as_view(), name='stats-client'),
    path('destinations/', DestinationListAPIView.as_view(), name='destination-list'),
    path('destinations/<str:ville>/etablissements/', EtablissementsParVilleAPIView.as_view(), name='etablissements-par-ville'),
    path("auth/destinations/<str:ville>/etablissements/", EtablissementsParVilleAPIView.as_view()),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile_update'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),  # <- pour activer /api/accounts/etablissements/
]
