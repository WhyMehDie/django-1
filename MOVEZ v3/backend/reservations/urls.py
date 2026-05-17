from django.urls import path
from .views import (TerrainListView, TerrainCreateView, TerrainDetailView,
                    CoachListView, CoachAvailabilityView,
                    ReservationListCreateView, ReservationDetailView,
                    CancelReservationView)

urlpatterns = [
    path('terrains/', TerrainListView.as_view(), name='terrain_list'),
    path('terrains/create/', TerrainCreateView.as_view(), name='terrain_create'),
    path('terrains/<int:pk>/', TerrainDetailView.as_view(), name='terrain_detail'),
    path('coaches/', CoachListView.as_view(), name='coach_list'),
    path('coaches/<int:coach_id>/availability/', CoachAvailabilityView.as_view(), name='coach_availability'),
    path('reservations/', ReservationListCreateView.as_view(), name='reservation_list_create'),
    path('reservations/<int:pk>/', ReservationDetailView.as_view(), name='reservation_detail'),
    path('reservations/<int:pk>/cancel/', CancelReservationView.as_view(), name='reservation_cancel'),
]
