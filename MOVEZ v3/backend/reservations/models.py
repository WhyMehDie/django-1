from django.db import models
from django.conf import settings


class Terrain(models.Model):
    SPORT_CHOICES = [
        ('FOOTBALL', 'Football'),
        ('BASKETBALL', 'Basketball'),
        ('TENNIS', 'Tennis'),
        ('PADEL', 'Padel'),
        ('VOLLEYBALL', 'Volleyball'),
        ('OTHER', 'Autre'),
    ]

    name = models.CharField(max_length=200)
    sport = models.CharField(max_length=20, choices=SPORT_CHOICES)
    address = models.CharField(max_length=300)
    city = models.CharField(max_length=100)
    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2)
    capacity = models.IntegerField(default=2)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='terrains/', null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='managed_terrains'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.sport}) - {self.city}"


class CoachAvailability(models.Model):
    DAYS = [
        ('MON', 'Lundi'), ('TUE', 'Mardi'), ('WED', 'Mercredi'),
        ('THU', 'Jeudi'), ('FRI', 'Vendredi'), ('SAT', 'Samedi'), ('SUN', 'Dimanche'),
    ]
    coach = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='availabilities'
    )
    day_of_week = models.CharField(max_length=3, choices=DAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ('coach', 'day_of_week', 'start_time')

    def __str__(self):
        return f"{self.coach} - {self.day_of_week} {self.start_time}-{self.end_time}"


class Reservation(models.Model):
    TYPE_CHOICES = [
        ('TERRAIN', 'Terrain'),
        ('COACHING', 'Session Coaching'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('CONFIRMED', 'Confirmé'),
        ('CANCELLED', 'Annulé'),
        ('COMPLETED', 'Terminé'),
    ]

    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reservations'
    )
    reservation_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    terrain = models.ForeignKey(
        Terrain, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reservations'
    )
    coach = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='coaching_sessions'
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    is_paid = models.BooleanField(default=False)
    payment_reference = models.CharField(max_length=100, blank=True)
    split_payment = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-start_time']

    def __str__(self):
        return f"{self.player} - {self.reservation_type} on {self.date}"
