# 📁 accounts/management/commands/update_disponibilite.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import Reservation

class Command(BaseCommand):
    help = "Met à jour automatiquement la disponibilité des chambres/tables après la fin de réservation"

    def handle(self, *args, **kwargs):
        now = timezone.now()
        reservations = Reservation.objects.filter(
            statut='confirmee',
            date_fin__lt=now
        )

        updated = 0

        for reservation in reservations:
            # Libération chambre ou table, SANS condition
            if reservation.chambre:
                reservation.chambre.disponible = True
                reservation.chambre.save()

            if reservation.table:
                reservation.table.disponible = True
                reservation.table.save()

            reservation.statut = 'terminee'
            reservation.save()
            updated += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ {updated} réservation(s) clôturée(s) et ressources libérées."
        ))
