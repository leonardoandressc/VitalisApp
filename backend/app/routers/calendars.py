from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.models import Calendar, User
from ..schemas.schemas import CalendarCreate, CalendarRead
from ..utils.slot_generator import generate_slots_for_calendar

router = APIRouter(prefix="/calendars", tags=["calendars"])

@router.post("/", response_model=CalendarRead)
def create_calendar(calendar: CalendarCreate, db: Session = Depends(get_db)):
    # por ahora lo asignamos a user_id=1 de ejemplo
    user_id = 1
    owner = db.query(User).filter(User.id == user_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner user not found")

    new_calendar = Calendar(
        name=calendar.name,
        description=calendar.description,
        owner_id=user_id
    )
    db.add(new_calendar)
    db.commit()
    db.refresh(new_calendar)
    
    generate_slots_for_calendar(new_calendar, db)
    
    return new_calendar

# POST http://localhost:8000/calendars
# Modelo de Json esperado
# {
#  "user_id": 1,
#  "name": "Calendario principal",
#  "meeting_duration": 30,
#  "slot_interval": 15
#}