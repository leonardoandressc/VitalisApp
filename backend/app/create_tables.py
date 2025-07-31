from app.database import engine, Base
from app.models.models import User, Calendar, AvailabilitySlot, Appointment, AvailabilityBlock, WeekDay

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

print("¡Tablas creadas exitosamente!")

# cd /root/calendario-app
# .venv/bin/python -m backend.app.create_tables
