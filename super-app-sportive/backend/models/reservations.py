from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from database import Base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Terrain(Base):
    __tablename__ = "terrains"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sport = Column(String, nullable=False)
    city = Column(String, nullable=False)
    price_per_hour = Column(Float, nullable=False)
    capacity = Column(Integer, default=2)

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True, index=True)
    terrain_id = Column(Integer, ForeignKey("terrains.id"), nullable=False)
    player_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(String, default="CONFIRMED")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Pydantic Schemas
class TerrainResponse(BaseModel):
    id: int
    name: str
    sport: str
    city: str
    price_per_hour: float
    capacity: int

    class Config:
        from_attributes = True

class ReservationCreate(BaseModel):
    terrain_id: int
    start_time: datetime
    end_time: datetime

class ReservationResponse(ReservationCreate):
    id: int
    player_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
