from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import engine, Base, get_db
from backend.app.routers import users, calendars, appointments, availability_slots, availability

Base.metadata.create_all(bind=engine)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"message": "Servidor FastAPI funcionando correctamente"}

app.include_router(users.router)
app.include_router(calendars.router)
app.include_router(appointments.router)
app.include_router(availability_slots.router)
app.include_router(availability.router)
