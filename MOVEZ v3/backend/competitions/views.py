from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Tournament, TournamentParticipant, Match, Sponsor
from .serializers import (TournamentSerializer, TournamentListSerializer,
                          TournamentParticipantSerializer, MatchSerializer, SponsorSerializer)
import math


class TournamentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['sport', 'status', 'format']
    search_fields = ['name', 'sport', 'location']
    ordering_fields = ['start_date', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Tournament.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TournamentListSerializer
        return TournamentSerializer


class TournamentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tournament.objects.all()


class TournamentRegisterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        tournament = generics.get_object_or_404(Tournament, pk=pk)
        if tournament.status != 'OPEN':
            return Response({'detail': 'Les inscriptions sont fermées.'}, status=status.HTTP_400_BAD_REQUEST)
        if tournament.participants.count() >= tournament.max_participants:
            return Response({'detail': 'Le tournoi est complet.'}, status=status.HTTP_400_BAD_REQUEST)
        participant, created = TournamentParticipant.objects.get_or_create(
            tournament=tournament, player=request.user
        )
        if not created:
            return Response({'detail': 'Vous êtes déjà inscrit.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(TournamentParticipantSerializer(participant).data, status=status.HTTP_201_CREATED)


class BracketGenerateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        tournament = generics.get_object_or_404(Tournament, pk=pk)
        if request.user != tournament.organizer and not request.user.is_staff:
            return Response({'detail': 'Non autorisé.'}, status=status.HTTP_403_FORBIDDEN)

        participants = list(tournament.participants.order_by('?'))  # random seeding
        count = len(participants)
        if count < 2:
            return Response({'detail': 'Pas assez de participants.'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate round 1 matches
        Match.objects.filter(tournament=tournament).delete()
        rounds = math.ceil(math.log2(count))
        match_num = 1
        for i in range(0, count - 1, 2):
            p1 = participants[i].player if i < count else None
            p2 = participants[i + 1].player if i + 1 < count else None
            Match.objects.create(
                tournament=tournament,
                round_number=1,
                match_number=match_num,
                player1=p1,
                player2=p2
            )
            match_num += 1
        tournament.status = 'IN_PROGRESS'
        tournament.save()
        return Response({'detail': f'Bracket généré avec {match_num - 1} matchs au round 1.'})


class MatchScoreUpdateView(generics.UpdateAPIView):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Match.objects.all()

    def patch(self, request, *args, **kwargs):
        match = self.get_object()
        if request.user != match.tournament.organizer and not request.user.is_staff:
            return Response({'detail': 'Non autorisé.'}, status=status.HTTP_403_FORBIDDEN)
        s1 = request.data.get('score_player1')
        s2 = request.data.get('score_player2')
        if s1 is None or s2 is None:
            return Response({'detail': 'Les deux scores sont requis.'}, status=status.HTTP_400_BAD_REQUEST)
        match.score_player1 = int(s1)
        match.score_player2 = int(s2)
        match.winner = match.player1 if int(s1) > int(s2) else match.player2
        match.status = 'COMPLETED'
        match.save()
        return Response(MatchSerializer(match).data)


class TournamentBracketView(generics.RetrieveAPIView):
    serializer_class = TournamentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tournament.objects.all()

class SponsorListView(generics.ListAPIView):
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    permission_classes = [permissions.AllowAny]
