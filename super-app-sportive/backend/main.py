from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # We will import models here to ensure they are registered with Base metadata
    import models.users
    import models.reservations
    import models.matchmaking
    import models.competitions
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Movez API - Super App Sportive", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes import users, reservations, matchmaking, competitions

app.include_router(users.router, prefix="/api")
app.include_router(reservations.router, prefix="/api")
app.include_router(matchmaking.router, prefix="/api")
app.include_router(competitions.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Movez API!"}
