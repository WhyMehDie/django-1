from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from sqlalchemy.sql import func
from database import Base
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class Tournament(Base):
    __tablename__ = "tournaments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sport = Column(String, nullable=False)
    organizer_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="OPEN")
    max_participants = Column(Integer, default=8)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TournamentParticipant(Base):
    __tablename__ = "tournament_participants"
    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"))
    player_id = Column(Integer, ForeignKey("users.id"))

class MatchBracket(Base):
    __tablename__ = "match_brackets"
    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"))
    round_number = Column(Integer, default=1)
    match_number = Column(Integer, default=1)
    player1_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    player2_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    winner_id = Column(Integer, ForeignKey("users.id"), nullable=True)

class TournamentCreate(BaseModel):
    name: str
    sport: str
    max_participants: int
    start_date: date
    end_date: date

class TournamentResponse(TournamentCreate):
    id: int
    organizer_id: int
    status: str
    
    class Config:
        from_attributes = True
        
class BracketNode(BaseModel):
    round_number: int
    match_number: int
    player1_id: Optional[int]
    player2_id: Optional[int]
    winner_id: Optional[int]
    
    class Config:
        from_attributes = True
