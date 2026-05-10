from pydantic import BaseModel
from typing import List
from models.users import UserResponse

class MatchmakingRequest(BaseModel):
    sport: str
    city: str
    target_players_count: int = 4

class MatchmakingResponse(BaseModel):
    group_found: bool
    players: List[UserResponse]
