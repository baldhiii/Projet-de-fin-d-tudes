from django.urls import path
from .views import GerantDashboardOverview, DernieresReservationsGerantView

urlpatterns = [
    path("dashboard/overview/", GerantDashboardOverview.as_view(), name="dashboard-gerant-overview"),
    path("dashboard/dernieres-reservations/", DernieresReservationsGerantView.as_view(), name="dashboard-dernieres-reservations"),
]
