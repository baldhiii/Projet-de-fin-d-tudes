from django.core.mail import send_mail
from django.conf import settings

def send_confirmation_email(user_email, client_name, etablissement, date_debut, date_fin, montant, reference, type_reservation):
    if type_reservation == 'hotel':
        subject = "Confirmation de votre réservation - Hôtel Luxvia"
        html_message = f"""
            <h2>Bonjour {client_name},</h2>
            <p>Votre réservation à <strong>{etablissement}</strong> a été <strong>confirmée</strong>.</p>
            <ul>
              <li><strong>Du :</strong> {date_debut}</li>
              <li><strong>Au :</strong> {date_fin}</li>
              <li><strong>Montant :</strong> {montant} MAD</li>
              <li><strong>Référence :</strong> {reference}</li>
            </ul>
            <p>Merci d’avoir choisi Luxvia 🌟</p>
        """
    else:
        subject = "Confirmation de votre réservation - Restaurant Luxvia"
        html_message = f"""
            <h2>Bonjour {client_name},</h2>
            <p>Votre réservation au restaurant <strong>{etablissement}</strong> a été <strong>confirmée</strong>.</p>
            <ul>
              <li><strong>Date et heure d'arriver :</strong> {date_debut}</li>
              <li><strong>Date et Heure de partir :</strong> {date_fin}</li>
              <li><strong>Montant :</strong> {montant} MAD</li>
              <li><strong>Référence :</strong> {reference}</li>
            </ul>
            <p>Nous avons hâte de vous accueillir 🍽️</p>
        """

    send_mail(
        subject,
        "",  
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        html_message=html_message
        
    )
