from django.db import models
from django.conf import settings


class Tournament(models.Model):
    FORMAT_CHOICES = [
        ('SINGLE_ELIMINATION', 'Élimination simple'),
        ('DOUBLE_ELIMINATION', 'Double élimination'),
        ('ROUND_ROBIN', 'Round Robin'),
    ]
    STATUS_CHOICES = [
        ('DRAFT', 'Brouillon'),
        ('OPEN', 'Inscriptions ouvertes'),
        ('IN_PROGRESS', 'En cours'),
        ('COMPLETED', 'Terminé'),
        ('CANCELLED', 'Annulé'),
    ]

    name = models.CharField(max_length=200)
    sport = models.CharField(max_length=100)
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organized_tournaments'
    )
    format = models.CharField(max_length=25, choices=FORMAT_CHOICES, default='SINGLE_ELIMINATION')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='DRAFT')
    max_participants = models.IntegerField(default=8)
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    prize = models.CharField(max_length=200, blank=True)
    registration_deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.sport})"


class TournamentParticipant(models.Model):
    tournament = models.ForeignKey(
        Tournament,
        on_delete=models.CASCADE,
        related_name='participants'
    )
    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tournament_participations'
    )
    seed = models.IntegerField(null=True, blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tournament', 'player')

    def __str__(self):
        return f"{self.player} in {self.tournament}"


class Match(models.Model):
    STATUS_CHOICES = [
        ('SCHEDULED', 'Programmé'),
        ('IN_PROGRESS', 'En cours'),
        ('COMPLETED', 'Terminé'),
        ('WALKOVER', 'Forfait'),
    ]

    tournament = models.ForeignKey(
        Tournament,
        on_delete=models.CASCADE,
        related_name='matches'
    )
    round_number = models.IntegerField(default=1)
    match_number = models.IntegerField(default=1)
    player1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='matches_as_player1'
    )
    player2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='matches_as_player2'
    )
    winner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='won_matches'
    )
    score_player1 = models.IntegerField(null=True, blank=True)
    score_player2 = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='SCHEDULED')
    scheduled_at = models.DateTimeField(null=True, blank=True)
    played_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['round_number', 'match_number']
        unique_together = ('tournament', 'round_number', 'match_number')

    def __str__(self):
        return f"{self.tournament} - R{self.round_number}M{self.match_number}"

class Sponsor(models.Model):
    name = models.CharField(max_length=200)
    logo_url = models.URLField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name
