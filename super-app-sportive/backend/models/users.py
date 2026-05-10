from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default="JOUEUR")
    city = Column(String, nullable=True)
    sport = Column(String, nullable=True)
    elo_rating = Column(Integer, default=1000)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Pydantic Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: str = "JOUEUR"
    city: Optional[str] = None
    sport: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    elo_rating: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
