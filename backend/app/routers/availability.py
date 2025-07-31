from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.schemas import AvailabilityBlockCreate, AvailabilityBlockOut
from .. import models
from ..models.models import Calendar, AvailabilitySlot
from ..utils.slot_generator import generate_slots_for_calendar


router = APIRouter(prefix="/availability", tags=["Availability"])

@router.post("/calendars/{calendar_id}/availability", response_model=List[AvailabilityBlockOut])
def create_availability_blocks(
    calendar_id: int,
    blocks: List[AvailabilityBlockCreate],
    db: Session = Depends(get_db)
):
    saved_blocks = []
    for block in blocks:
        availability = models.AvailabilityBlock(
            calendar_id=calendar_id,
            **block.dict()
        )
        db.add(availability)
        saved_blocks.append(availability)
    db.commit()
    return saved_blocks

#Modelo de Json esperado
# POST http://localhost:8000/availability/calendars/1/availability
#[
#  {
#    "day_of_week": "mon",
#    "start_time": "09:00:00",
#    "end_time": "13:00:00"
#  },
#  {
#    "day_of_week": "wed",
#    "start_time": "15:00:00",
#    "end_time": "18:00:00"
#  }
#]

@router.post("/generate-slots")
def generate_slots(calendar_id: int, db: Session = Depends(get_db)):
    calendar = db.query(Calendar).filter_by(id=calendar_id).first()
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendario no encontrado")
    
    generate_slots_for_calendar(calendar, db)
    return {"detail": "Slots generados correctamente"}

#   POST http://localhost:8000/availability/generate-slots?calendar_id=1
#   Headers: Content-Type: application/json


class FreeSlotRequest(BaseModel):
    calendar_id: int
    start_date: date
    end_date: date
    meeting_duration: int  # minutos

class FreeSlotItem(BaseModel):
    start: datetime
    end: datetime

class FreeSlotsResponse(BaseModel):
    free_slots: List[FreeSlotItem]

@router.post("/free-slots", response_model=FreeSlotsResponse)
def get_free_slots(req: FreeSlotRequest, db: Session = Depends(get_db)):
    calendar_id = req.calendar_id
    start_date = req.start_date
    end_date = req.end_date
    meeting_duration = timedelta(minutes=req.meeting_duration)

    # Consulta slots del calendario dentro del rango
    slots = db.query(AvailabilitySlot).filter(
        AvailabilitySlot.calendar_id == calendar_id,
        AvailabilitySlot.start_time >= datetime.combine(start_date, datetime.min.time()),
        AvailabilitySlot.end_time <= datetime.combine(end_date, datetime.max.time()),
        AvailabilitySlot.is_booked == False
    ).all()

    free_slots = []

    for slot in slots:
        slot_duration = slot.end_time - slot.start_time
        if slot_duration >= meeting_duration:
            free_slots.append({
                "start": slot.start_time,
                "end": slot.end_time
            })

    return {"free_slots": free_slots}