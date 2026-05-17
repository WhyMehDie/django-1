from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import PlayerEvaluation, MatchRequest, EloHistory
from .serializers import PlayerEvaluationSerializer, MatchRequestSerializer, EloHistorySerializer
from users.serializers import UserPublicSerializer

User = get_user_model()


class PlayerEvaluationCreateView(generics.CreateAPIView):
    serializer_class = PlayerEvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]


class PlayerEvaluationListView(generics.ListAPIView):
    serializer_class = PlayerEvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return PlayerEvaluation.objects.filter(evaluated_id=user_id)


class MatchRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = MatchRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return MatchRequest.objects.filter(
            requester=user
        ) | MatchRequest.objects.filter(receiver=user)


class MatchRequestUpdateView(generics.UpdateAPIView):
    serializer_class = MatchRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = MatchRequest.objects.all()

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('status')
        if instance.receiver != request.user:
            return Response({'detail': 'Non autorisé.'}, status=status.HTTP_403_FORBIDDEN)
        if new_status not in ['ACCEPTED', 'REJECTED']:
            return Response({'detail': 'Statut invalide.'}, status=status.HTTP_400_BAD_REQUEST)
        instance.status = new_status
        instance.save()
        return Response(MatchRequestSerializer(instance).data)


class PlayerSearchView(generics.ListAPIView):
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['sport', 'city', 'role']
    search_fields = ['first_name', 'last_name', 'sport']
    ordering_fields = ['elo_rating']
    ordering = ['-elo_rating']

    def get_queryset(self):
        return User.objects.filter(is_active=True, role='JOUEUR').exclude(id=self.request.user.id)


class EloRankingView(generics.ListAPIView):
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['sport']

    def get_queryset(self):
        return User.objects.filter(is_active=True, role='JOUEUR').order_by('-elo_rating')[:50]


class EloHistoryView(generics.ListAPIView):
    serializer_class = EloHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id', self.request.user.id)
        return EloHistory.objects.filter(user_id=user_id)
