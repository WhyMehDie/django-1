from django.contrib import admin
from .models import Tournament, TournamentParticipant, Match


@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'sport', 'format', 'status', 'max_participants', 'start_date', 'end_date')
    list_filter = ('sport', 'status', 'format')
    search_fields = ('name', 'location')
    date_hierarchy = 'start_date'


@admin.register(TournamentParticipant)
class TournamentParticipantAdmin(admin.ModelAdmin):
    list_display = ('tournament', 'player', 'seed', 'registered_at')
    list_filter = ('tournament',)
    search_fields = ('player__email', 'tournament__name')


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('tournament', 'round_number', 'match_number', 'player1', 'player2', 'winner', 'status')
    list_filter = ('tournament', 'status', 'round_number')
