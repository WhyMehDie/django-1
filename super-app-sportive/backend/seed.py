import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from database import engine, Base, AsyncSessionLocal
from models.users import User
from models.reservations import Terrain
from services.auth import get_password_hash

async def seed():
    async with AsyncSessionLocal() as db:
        hashed = get_password_hash("joueur123")
        u1 = User(
            email="joueur@sport.dz",
            hashed_password=hashed,
            first_name="Test",
            last_name="User",
            role="JOUEUR",
            city="Casablanca",
            sport="Tennis",
            elo_rating=1500
        )
        t1 = Terrain(
            name="Terrain Central",
            sport="Tennis",
            city="Casablanca",
            price_per_hour=200.0,
            capacity=4
        )
        db.add_all([u1, t1])
        await db.commit()
        print("Database seeded with Test User and Terrain!")

if __name__ == "__main__":
    asyncio.run(seed())
