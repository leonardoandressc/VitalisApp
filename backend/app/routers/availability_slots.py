from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.models import AvailabilitySlot, Calendar
from ..schemas.schemas import AvailabilitySlotCreate, AvailabilitySlotRead, AvailabilitySlotOut

router = APIRouter(prefix="/availability_slots", tags=["availability_slots"])

@router.post("/", response_model=AvailabilitySlotRead)
def create_availability_slot(slot: AvailabilitySlotCreate, db: Session = Depends(get_db)):
    calendar = db.query(Calendar).filter(Calendar.id == slot.calendar_id).first()
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar not found")
    new_slot = AvailabilitySlot(
        calendar_id=slot.calendar_id,
        start_time=slot.start_time,
        end_time=slot.end_time,
        is_booked=slot.is_booked or False
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.get("/", response_model=List[AvailabilitySlotOut])
def get_availability_slots(
    calendar_id: int = Query(..., description="ID del calendario"),
    db: Session = Depends(get_db)
):
    slots = db.query(AvailabilitySlot).filter(AvailabilitySlot.calendar_id == calendar_id).all()
    return slots

# GET http://localhost:8000/availability_slots/?calendar_id=1