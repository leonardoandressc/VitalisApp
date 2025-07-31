from datetime import datetime, timedelta, time
from ..models.models import AvailabilitySlot, AvailabilityBlock
from sqlalchemy.orm import Session

def generate_slots_for_calendar(calendar, db: Session):
    # Elimina todos los slots existentes para este calendario
    db.query(AvailabilitySlot).filter_by(calendar_id=calendar.id).delete()

    # Recupera los bloques de disponibilidad de ese calendario
    availability_blocks = db.query(AvailabilityBlock).filter_by(calendar_id=calendar.id).all()

    # Validación de configuración básica
    if calendar.meeting_duration is None or calendar.slot_interval is None:
        return

    # Generar para los próximos 30 días
    today = datetime.utcnow().date()
    end_date = today + timedelta(days=30)

    for single_date in (today + timedelta(n) for n in range((end_date - today).days)):
        weekday_str = single_date.strftime('%a').lower()[:3]  # ej: "mon", "tue"
        day_blocks = [b for b in availability_blocks if b.day_of_week == weekday_str]

        for block in day_blocks:
            start_time = datetime.combine(single_date, block.start_time)
            end_time = datetime.combine(single_date, block.end_time)

            current = start_time
            while current + timedelta(minutes=calendar.meeting_duration) <= end_time:
                new_slot = AvailabilitySlot(
                    calendar_id=calendar.id,
                    start_time=current,
                    end_time=current + timedelta(minutes=calendar.meeting_duration)
                )
                db.add(new_slot)
                current += timedelta(minutes=calendar.slot_interval)

    db.commit()
