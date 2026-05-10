from rest_framework import serializers
from .models import Terrain, Reservation, CoachAvailability
from users.serializers import UserPublicSerializer


class TerrainSerializer(serializers.ModelSerializer):
    manager_detail = UserPublicSerializer(source='manager', read_only=True)

    class Meta:
        model = Terrain
        fields = ('id', 'name', 'sport', 'address', 'city', 'price_per_hour',
                  'capacity', 'description', 'image', 'latitude', 'longitude',
                  'is_available', 'manager', 'manager_detail', 'created_at')
        read_only_fields = ('id', 'created_at')


class CoachAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CoachAvailability
        fields = ('id', 'coach', 'day_of_week', 'start_time', 'end_time')
        read_only_fields = ('coach',)

    def create(self, validated_data):
        validated_data['coach'] = self.context['request'].user
        return super().create(validated_data)


class ReservationSerializer(serializers.ModelSerializer):
    player_detail = UserPublicSerializer(source='player', read_only=True)
    terrain_detail = TerrainSerializer(source='terrain', read_only=True)
    coach_detail = UserPublicSerializer(source='coach', read_only=True)

    class Meta:
        model = Reservation
        fields = ('id', 'player', 'player_detail', 'reservation_type',
                  'terrain', 'terrain_detail', 'coach', 'coach_detail',
                  'date', 'start_time', 'end_time', 'total_price',
                  'status', 'is_paid', 'payment_reference', 'split_payment',
                  'notes', 'created_at')
        read_only_fields = ('player', 'is_paid', 'payment_reference', 'created_at')

    def create(self, validated_data):
        validated_data['player'] = self.context['request'].user
        return super().create(validated_data)
