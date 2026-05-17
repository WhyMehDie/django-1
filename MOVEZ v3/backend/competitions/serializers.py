from rest_framework import serializers
from .models import Tournament, TournamentParticipant, Match, Sponsor
from users.serializers import UserPublicSerializer


class MatchSerializer(serializers.ModelSerializer):
    player1_detail = UserPublicSerializer(source='player1', read_only=True)
    player2_detail = UserPublicSerializer(source='player2', read_only=True)
    winner_detail = UserPublicSerializer(source='winner', read_only=True)

    class Meta:
        model = Match
        fields = ('id', 'tournament', 'round_number', 'match_number',
                  'player1', 'player1_detail', 'player2', 'player2_detail',
                  'winner', 'winner_detail', 'score_player1', 'score_player2',
                  'status', 'scheduled_at', 'played_at', 'notes')


class TournamentParticipantSerializer(serializers.ModelSerializer):
    player_detail = UserPublicSerializer(source='player', read_only=True)

    class Meta:
        model = TournamentParticipant
        fields = ('id', 'tournament', 'player', 'player_detail', 'seed', 'registered_at')
        read_only_fields = ('registered_at',)


class TournamentSerializer(serializers.ModelSerializer):
    organizer_detail = UserPublicSerializer(source='organizer', read_only=True)
    participants_count = serializers.SerializerMethodField()
    matches = MatchSerializer(many=True, read_only=True)

    class Meta:
        model = Tournament
        fields = ('id', 'name', 'sport', 'organizer', 'organizer_detail',
                  'format', 'status', 'max_participants', 'participants_count',
                  'start_date', 'end_date', 'location', 'description',
                  'prize', 'registration_deadline', 'matches', 'created_at')
        read_only_fields = ('organizer', 'created_at')

    def get_participants_count(self, obj):
        return obj.participants.count()

    def create(self, validated_data):
        validated_data['organizer'] = self.context['request'].user
        return super().create(validated_data)


class TournamentListSerializer(serializers.ModelSerializer):
    organizer_detail = UserPublicSerializer(source='organizer', read_only=True)
    participants_count = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ('id', 'name', 'sport', 'organizer_detail', 'format',
                  'status', 'max_participants', 'participants_count',
                  'start_date', 'end_date', 'location', 'prize')

    def get_participants_count(self, obj):
        return obj.participants.count()

class SponsorSerializer(serializers.ModelSerializer):
    logo = serializers.URLField(source='logo_url')

    class Meta:
        model = Sponsor
        fields = ('id', 'name', 'logo', 'order')
