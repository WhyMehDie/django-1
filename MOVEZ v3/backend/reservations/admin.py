from django.contrib import admin
from .models import Terrain, Reservation, CoachAvailability


@admin.register(Terrain)
class TerrainAdmin(admin.ModelAdmin):
    list_display = ('name', 'sport', 'city', 'price_per_hour', 'is_available')
    list_filter = ('sport', 'city', 'is_available')
    search_fields = ('name', 'city', 'address')


@admin.register(CoachAvailability)
class CoachAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('coach', 'day_of_week', 'start_time', 'end_time')
    list_filter = ('day_of_week',)


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('player', 'reservation_type', 'date', 'start_time', 'status', 'is_paid', 'total_price')
    list_filter = ('reservation_type', 'status', 'is_paid')
    search_fields = ('player__email',)
    date_hierarchy = 'date'
