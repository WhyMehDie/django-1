from django.urls import path
from .views import (PlayerEvaluationCreateView, PlayerEvaluationListView,
                    MatchRequestListCreateView, MatchRequestUpdateView,
                    PlayerSearchView, EloRankingView, EloHistoryView)

urlpatterns = [
    path('search/', PlayerSearchView.as_view(), name='player_search'),
    path('ranking/', EloRankingView.as_view(), name='elo_ranking'),
    path('evaluate/', PlayerEvaluationCreateView.as_view(), name='evaluation_create'),
    path('evaluations/<int:user_id>/', PlayerEvaluationListView.as_view(), name='evaluation_list'),
    path('elo-history/', EloHistoryView.as_view(), name='my_elo_history'),
    path('elo-history/<int:user_id>/', EloHistoryView.as_view(), name='user_elo_history'),
    path('requests/', MatchRequestListCreateView.as_view(), name='match_requests'),
    path('requests/<int:pk>/', MatchRequestUpdateView.as_view(), name='match_request_update'),
]
