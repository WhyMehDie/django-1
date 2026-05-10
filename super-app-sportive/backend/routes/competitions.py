from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from database import get_db
from models.competitions import Tournament, TournamentCreate, TournamentResponse, TournamentParticipant, MatchBracket, BracketNode
from models.users import User
from services.auth import get_current_user
from services.competitions import generate_bracket

router = APIRouter(prefix="/competitions", tags=["Competitions"])

@router.post("/tournaments", response_model=TournamentResponse)
async def create_tournament(
    req: TournamentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["ORGANISATEUR", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Uniquement l'organisateur peut créer un tournoi")
        
    t = Tournament(
        name=req.name,
        sport=req.sport,
        organizer_id=current_user.id,
        max_participants=req.max_participants,
        start_date=req.start_date,
        end_date=req.end_date
    )
    db.add(t)
    await db.commit()
    await db.refresh(t)
    return t

@router.post("/tournaments/{tid}/register")
async def register_tournament(
    tid: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    t_stmt = select(Tournament).where(Tournament.id == tid)
    res = await db.execute(t_stmt)
    t = res.scalars().first()
    if not t or t.status != "OPEN":
        raise HTTPException(status_code=400, detail="Tournoi indisponible ou déjà lancé.")
        
    tp = TournamentParticipant(tournament_id=tid, player_id=current_user.id)
    db.add(tp)
    await db.commit()
    return {"status": "Inscrit avec succès !"}

@router.post("/tournaments/{tid}/generate-bracket")
async def build_bracket(
    tid: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await generate_bracket(db, tid)
    return {"status": "Arbre généré de manière automatisée !"}

@router.get("/tournaments/{tid}/bracket", response_model=List[BracketNode])
async def get_bracket(tid: int, db: AsyncSession = Depends(get_db)):
    stmt = select(MatchBracket).where(MatchBracket.tournament_id == tid).order_by(MatchBracket.round_number, MatchBracket.match_number)
    res = await db.execute(stmt)
    return res.scalars().all()
