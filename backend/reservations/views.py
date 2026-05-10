from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Terrain, Reservation, CoachAvailability
from .serializers import TerrainSerializer, ReservationSerializer, CoachAvailabilitySerializer
from django.contrib.auth import get_user_model
from users.serializers import UserPublicSerializer

User = get_user_model()


class TerrainListView(generics.ListAPIView):
    serializer_class = TerrainSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['sport', 'city', 'is_available']
    search_fields = ['name', 'city', 'address']
    ordering_fields = ['price_per_hour', 'name']
    ordering = ['name']

    def get_queryset(self):
        return Terrain.objects.filter(is_available=True)


class TerrainCreateView(generics.CreateAPIView):
    serializer_class = TerrainSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)


class TerrainDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TerrainSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Terrain.objects.all()


class CoachListView(generics.ListAPIView):
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['sport', 'city']
    search_fields = ['first_name', 'last_name', 'sport']
    ordering_fields = ['elo_rating']

    def get_queryset(self):
        return User.objects.filter(is_active=True, role='COACH')


class CoachAvailabilityView(generics.ListCreateAPIView):
    serializer_class = CoachAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        coach_id = self.kwargs.get('coach_id')
        return CoachAvailability.objects.filter(coach_id=coach_id)


class ReservationListCreateView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'reservation_type']

    def get_queryset(self):
        user = self.request.user
        if user.role in ['GERANT', 'ADMIN']:
            return Reservation.objects.all()
        return Reservation.objects.filter(player=user)


class ReservationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['GERANT', 'ADMIN']:
            return Reservation.objects.all()
        return Reservation.objects.filter(player=user)


class CancelReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            reservation = Reservation.objects.get(pk=pk, player=request.user)
        except Reservation.DoesNotExist:
            return Response({'detail': 'Réservation introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        if reservation.status in ['COMPLETED', 'CANCELLED']:
            return Response({'detail': 'Impossible d\'annuler cette réservation.'}, status=status.HTTP_400_BAD_REQUEST)
        reservation.status = 'CANCELLED'
        reservation.save()
        return Response({'detail': 'Réservation annulée.'})
