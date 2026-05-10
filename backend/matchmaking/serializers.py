from rest_framework import serializers
from .models import PlayerEvaluation, MatchRequest, EloHistory
from users.serializers import UserPublicSerializer


class PlayerEvaluationSerializer(serializers.ModelSerializer):
    evaluator_detail = UserPublicSerializer(source='evaluator', read_only=True)
    evaluated_detail = UserPublicSerializer(source='evaluated', read_only=True)

    class Meta:
        model = PlayerEvaluation
        fields = ('id', 'evaluator', 'evaluated', 'evaluator_detail', 'evaluated_detail',
                  'rating', 'comment', 'sport', 'created_at')
        read_only_fields = ('evaluator', 'created_at')

    def create(self, validated_data):
        validated_data['evaluator'] = self.context['request'].user
        return super().create(validated_data)


class MatchRequestSerializer(serializers.ModelSerializer):
    requester_detail = UserPublicSerializer(source='requester', read_only=True)
    receiver_detail = UserPublicSerializer(source='receiver', read_only=True)

    class Meta:
        model = MatchRequest
        fields = ('id', 'requester', 'receiver', 'requester_detail', 'receiver_detail',
                  'sport', 'message', 'status', 'created_at', 'updated_at')
        read_only_fields = ('requester', 'status', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['requester'] = self.context['request'].user
        return super().create(validated_data)


class EloHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EloHistory
        fields = ('id', 'old_rating', 'new_rating', 'change', 'reason', 'created_at')
