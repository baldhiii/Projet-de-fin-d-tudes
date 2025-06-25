
from djoser import email

class CustomActivationEmail(email.ActivationEmail):
    def get_context_data(self):
        context = super().get_context_data()
        context['domain'] = "localhost:5173"  
        context['site_name'] = "Luxvia"
        return context
