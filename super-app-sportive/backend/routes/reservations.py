from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from database import get_db
from models.reservations import Terrain, Reservation, ReservationCreate, ReservationResponse, TerrainResponse
from models.users import User
from services.auth import get_current_user
from services.reservations import book_terrain

router = APIRouter(prefix="/reservations", tags=["Reservations"])

@router.get("/terrains", response_model=List[TerrainResponse])
async def list_terrains(sport: str = None, db: AsyncSession = Depends(get_db)):
    stmt = select(Terrain)
    if sport:
        stmt = stmt.where(Terrain.sport == sport)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=ReservationResponse)
async def create_reservation(
    res_data: ReservationCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await book_terrain(db, res_data, current_user.id)

@router.get("/mine", response_model=List[ReservationResponse])
async def my_reservations(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Reservation).where(Reservation.player_id == current_user.id))
    return result.scalars().all()
