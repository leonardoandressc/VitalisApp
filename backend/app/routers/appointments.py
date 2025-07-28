from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import Appointment, User, Calendar
from backend.app.schemas.schemas import AppointmentCreate, AppointmentRead

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("/", response_model=AppointmentRead)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    # Validar que calendario exista
    calendar = db.query(Calendar).filter(Calendar.id == appointment.calendar_id).first()
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")

    # Validar que usuario exista
    user = db.query(User).filter(User.id == appointment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_appointment = Appointment(
        start_time=appointment.start_time,
        end_time=appointment.end_time,
        calendar_id=appointment.calendar_id,
        user_id=appointment.user_id,
        description=appointment.description
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment

@router.get("/{appointment_id}", response_model=AppointmentRead)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment
