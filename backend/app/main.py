from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Agregar el directorio raíz al path para importaciones absolutas
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base
from app.routers import users, calendars, appointments, availability_slots, availability, auth, doctor_profile

Base.metadata.create_all(bind=engine)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"message": "Servidor FastAPI funcionando correctamente"}

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(calendars.router)
app.include_router(appointments.router)
app.include_router(availability_slots.router)
app.include_router(availability.router)
app.include_router(doctor_profile.router)
