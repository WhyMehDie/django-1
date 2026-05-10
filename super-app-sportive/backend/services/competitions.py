from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.competitions import Tournament, TournamentParticipant, MatchBracket
from fastapi import HTTPException

async def generate_bracket(db: AsyncSession, tournament_id: int):
    # Fetches all participants for a tournament and creates bracket pairings
    stmt = select(TournamentParticipant).where(TournamentParticipant.tournament_id == tournament_id)
    res = await db.execute(stmt)
    participants = res.scalars().all()
    count = len(participants)
    
    if count < 2:
        raise HTTPException(status_code=400, detail="Pas assez de participants pour générer l'arbre")
        
    del_stmt = select(MatchBracket).where(MatchBracket.tournament_id == tournament_id)
    del_res = await db.execute(del_stmt)
    for old_match in del_res.scalars().all():
        await db.delete(old_match)
        
    # Generate 1st Round pairings
    match_num = 1
    for i in range(0, count - 1, 2):
        p1 = participants[i].player_id
        p2 = participants[i+1].player_id
        
        match = MatchBracket(
            tournament_id=tournament_id,
            round_number=1,
            match_number=match_num,
            player1_id=p1,
            player2_id=p2
        )
        db.add(match)
        match_num += 1
        
    # Change tournament lifecycle status
    t_stmt = select(Tournament).where(Tournament.id == tournament_id)
    t_res = await db.execute(t_stmt)
    tournament = t_res.scalars().first()
    if tournament:
        tournament.status = "IN_PROGRESS"
        db.add(tournament)
        
    await db.commit()
