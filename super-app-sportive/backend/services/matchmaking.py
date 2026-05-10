from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from models.users import User
from models.matchmaking import MatchmakingRequest
from fastapi import HTTPException
from typing import List

async def find_match_group(db: AsyncSession, request: MatchmakingRequest, me: User) -> List[User]:
    # Trouver X joueurs pour compléter le groupe de sport avec un Elo similaire.
    needed = request.target_players_count - 1
    
    stmt = select(User).where(
        User.id != me.id,
        User.sport == request.sport,
        User.city == request.city
    ).order_by(
        func.abs(User.elo_rating - me.elo_rating)
    ).limit(needed)
    
    result = await db.execute(stmt)
    peers = result.scalars().all()
    
    if len(peers) < needed:
        raise HTTPException(
            status_code=404, 
            detail=f"Pas assez de joueurs trouvés. Besoin de {needed}, trouvé {len(peers)}."
        )
        
    group = [me] + list(peers)
    return group

async def update_elo(db: AsyncSession, winner_ids: List[int], loser_ids: List[int]):
    # Implémentation Transactionnelle des points Elo
    stmt_win = select(User).where(User.id.in_(winner_ids)).with_for_update()
    res_win = await db.execute(stmt_win)
    for w in res_win.scalars().all():
        w.elo_rating += 25
        db.add(w)
        
    stmt_lose = select(User).where(User.id.in_(loser_ids)).with_for_update()
    res_lose = await db.execute(stmt_lose)
    for l in res_lose.scalars().all():
        l.elo_rating = max(0, l.elo_rating - 25)
        db.add(l)
        
    await db.commit()
