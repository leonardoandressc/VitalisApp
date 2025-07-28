from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.models import AvailabilitySlot, Calendar
from app.schemas.schemas import AvailabilitySlotOut
from app.database import get_db

router = APIRouter(tags=["Availability Slots"])

@router.get("/calendars/{calendar_id}/available-slots", response_model=list[AvailabilitySlotOut])
def get_available_slots(
    calendar_id: int,
    start_date: datetime = Query(...),
    end_date: datetime = Query(...),
    db: Session = Depends(get_db)
):
    calendar = db.query(Calendar).filter_by(id=calendar_id).first()
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendario no encontrado")

    slots = db.query(AvailabilitySlot).filter(
        AvailabilitySlot.calendar_id == calendar_id,
        AvailabilitySlot.start_time >= start_date,
        AvailabilitySlot.end_time <= end_date,
        AvailabilitySlot.is_booked == False
    ).order_by(AvailabilitySlot.start_time).all()

    return slots

