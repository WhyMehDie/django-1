from django.db import models
from django.conf import settings


class PlayerEvaluation(models.Model):
    evaluator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='evaluations_given'
    )
    evaluated = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='evaluations_received'
    )
    rating = models.IntegerField(default=3)  # 1-5 stars
    comment = models.TextField(blank=True)
    sport = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('evaluator', 'evaluated')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.evaluator} -> {self.evaluated}: {self.rating}/5"


class MatchRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('ACCEPTED', 'Accepté'),
        ('REJECTED', 'Refusé'),
        ('COMPLETED', 'Terminé'),
    ]

    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='match_requests_sent'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='match_requests_received'
    )
    sport = models.CharField(max_length=100)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.requester} -> {self.receiver} [{self.status}]"


class EloHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='elo_history'
    )
    old_rating = models.IntegerField()
    new_rating = models.IntegerField()
    change = models.IntegerField()
    reason = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user}: {self.old_rating} -> {self.new_rating}"
