from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models.matchmaking import MatchmakingRequest, MatchmakingResponse
from models.users import User
from services.auth import get_current_user
from services.matchmaking import find_match_group, update_elo
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/matchmaking", tags=["Matchmaking"])

@router.post("/find", response_model=MatchmakingResponse)
async def find_players(
    request: MatchmakingRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = await find_match_group(db, request, current_user)
    return MatchmakingResponse(
        group_found=True,
        players=group
    )

class MatchResult(BaseModel):
    winner_ids: List[int]
    loser_ids: List[int]

@router.post("/report-match")
async def report_match(
    result: MatchResult,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await update_elo(db, result.winner_ids, result.loser_ids)
    return {"status": "Elo ratings updated transactionally."}
