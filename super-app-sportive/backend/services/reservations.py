from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from models.reservations import Terrain, Reservation, ReservationCreate
from fastapi import HTTPException

async def book_terrain(db: AsyncSession, res_data: ReservationCreate, player_id: int):
    # ACID Transaction Logic: Use row lock to prevent a terrain from being booked
    # by multiple people at the exact same millisecond.
    stmt = select(Terrain).where(Terrain.id == res_data.terrain_id).with_for_update()
    result = await db.execute(stmt)
    terrain = result.scalars().first()
    
    if not terrain:
        raise HTTPException(status_code=404, detail="Terrain introuvable")
        
    overlap_stmt = select(Reservation).where(
        Reservation.terrain_id == res_data.terrain_id,
        Reservation.status == "CONFIRMED",
        and_(
            Reservation.start_time < res_data.end_time,
            Reservation.end_time > res_data.start_time
        )
    )
    overlap_res = await db.execute(overlap_stmt)
    if overlap_res.scalars().first():
        # Conflict averted gracefully
        raise HTTPException(status_code=400, detail="Réservation échouée : Créneau déjà pris (Conflit évité !)")
        
    new_res = Reservation(
        terrain_id=res_data.terrain_id,
        player_id=player_id,
        start_time=res_data.start_time,
        end_time=res_data.end_time
    )
    db.add(new_res)
    await db.commit()
    await db.refresh(new_res)
    
    return new_res
