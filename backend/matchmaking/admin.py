from django.contrib import admin
from .models import PlayerEvaluation, MatchRequest, EloHistory


@admin.register(PlayerEvaluation)
class PlayerEvaluationAdmin(admin.ModelAdmin):
    list_display = ('evaluator', 'evaluated', 'rating', 'sport', 'created_at')
    list_filter = ('rating', 'sport')
    search_fields = ('evaluator__email', 'evaluated__email')


@admin.register(MatchRequest)
class MatchRequestAdmin(admin.ModelAdmin):
    list_display = ('requester', 'receiver', 'sport', 'status', 'created_at')
    list_filter = ('status', 'sport')
    search_fields = ('requester__email', 'receiver__email')


@admin.register(EloHistory)
class EloHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'old_rating', 'new_rating', 'change', 'reason', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email',)
