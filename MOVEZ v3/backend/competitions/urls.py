from django.urls import path
from .views import (TournamentListCreateView, TournamentDetailView,
                    TournamentRegisterView, BracketGenerateView,
                    MatchScoreUpdateView, TournamentBracketView, SponsorListView)

urlpatterns = [
    path('tournaments/', TournamentListCreateView.as_view(), name='tournament_list_create'),
    path('tournaments/<int:pk>/', TournamentDetailView.as_view(), name='tournament_detail'),
    path('tournaments/<int:pk>/bracket/', TournamentBracketView.as_view(), name='tournament_bracket'),
    path('tournaments/<int:pk>/register/', TournamentRegisterView.as_view(), name='tournament_register'),
    path('tournaments/<int:pk>/generate-bracket/', BracketGenerateView.as_view(), name='bracket_generate'),
    path('matches/<int:pk>/score/', MatchScoreUpdateView.as_view(), name='match_score'),
    path('sponsors/', SponsorListView.as_view(), name='sponsor_list'),
]
