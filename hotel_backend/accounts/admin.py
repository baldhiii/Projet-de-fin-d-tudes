
from django.contrib import admin
from .models import Etablissement
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
    ImageEtablissement
)
from .models import Destination


@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_client', 'is_gerant', 'is_admin')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    list_filter = ('is_client', 'is_gerant', 'is_admin')


class EtablissementAdmin(admin.ModelAdmin):
    list_display = ("nom", "get_ville", "type")
    list_filter = ("destination", "type")

    def get_ville(self, obj):
        return obj.destination.ville
    get_ville.short_description = "Ville"
admin.site.register(Etablissement, EtablissementAdmin)

@admin.register(Chambre)
class ChambreAdmin(admin.ModelAdmin):
    list_display = ('nom', 'hotel', 'prix', 'capacite', 'disponible')
    list_filter = ('hotel', 'disponible')


@admin.register(TableRestaurant)
class TableRestaurantAdmin(admin.ModelAdmin):
    list_display = ('numero', 'restaurant', 'capacite', 'disponible')
    list_filter = ('restaurant', 'disponible')


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'client',
        'etablissement',
        'chambre',
        'date_debut',
        'date_fin',
        'statut',
    )
    list_filter = ('statut', 'etablissement')
    search_fields = ('client__email', 'etablissement__nom', 'chambre__nom')
    ordering = ('-date_reservation',)
    
@admin.register(Avis)
class AvisAdmin(admin.ModelAdmin):
    list_display = ('reservation', 'note', 'date')
    list_filter = ('note',)


@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = ('utilisateur', 'montant', 'methode', 'statut', 'date_paiement')
    list_filter = ('methode', 'statut')


@admin.register(EtablissementFavori)
class EtablissementFavoriAdmin(admin.ModelAdmin):
    list_display = ('utilisateur', 'etablissement', 'date_ajout')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('utilisateur', 'message', 'lu', 'date_creation')
    list_filter = ('lu',)


@admin.register(ServiceSupplementaire)
class ServiceSupplementaireAdmin(admin.ModelAdmin):
    list_display = ('nom', 'etablissement', 'prix')


@admin.register(ImageEtablissement)
class ImageEtablissementAdmin(admin.ModelAdmin):
    list_display = ('etablissement', 'description')


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['ville']
    def nombre_hotels(self, obj):
        return obj.nombre_hotels()
    nombre_hotels.short_description = "Nb Hôtels"

    def nombre_restaurants(self, obj):
        return obj.nombre_restaurants()
    nombre_restaurants.short_description = "Nb Restaurants"

