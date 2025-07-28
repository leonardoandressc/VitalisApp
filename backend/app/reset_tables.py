from backend.app.database import Base, engine
from backend.app.models.models import User, Calendar, AvailabilitySlot, Appointment, AvailabilityBlock

print("Eliminando tablas si existen...")
Base.metadata.drop_all(bind=engine)

print("Creando tablas nuevas...")
Base.metadata.create_all(bind=engine)

print("¡Tablas recreadas exitosamente!")

# cd /root/calendario-app
# .venv/bin/python -m backend.app.reset_tables