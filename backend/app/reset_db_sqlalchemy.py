import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, ForeignKey, Time, Date, Boolean, text

# Cargar variables de entorno
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

print(f"Conectando a la base de datos {DB_NAME} en {DB_HOST}:{DB_PORT}...")

try:
    # Crear conexión con SQLAlchemy usando opciones específicas
    engine = create_engine(
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
        echo=True,  # Para ver las consultas SQL
        connect_args={'client_encoding': 'latin1'}
    )
    
    # Crear conexión
    conn = engine.connect()
    
    # Crear metadatos
    metadata = MetaData()
    
    print("Conexión exitosa. Eliminando tablas si existen...")
    
    # Eliminar todas las tablas existentes
    conn.execute(text("""
    DROP TABLE IF EXISTS appointments CASCADE;
    DROP TABLE IF EXISTS availability_slots CASCADE;
    DROP TABLE IF EXISTS availability_blocks CASCADE;
    DROP TABLE IF EXISTS calendars CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    """))
    
    print("Tablas eliminadas. Creando tablas nuevas...")
    
    # Definir tablas
    users = Table(
        'users', metadata,
        Column('id', Integer, primary_key=True),
        Column('name', String, nullable=False),
        Column('email', String, nullable=False, unique=True),
        Column('hashed_password', String, nullable=False)
    )
    
    calendars = Table(
        'calendars', metadata,
        Column('id', Integer, primary_key=True),
        Column('name', String, nullable=False),
        Column('description', String),
        Column('owner_id', Integer, ForeignKey('users.id', ondelete='CASCADE'))
    )
    
    availability_blocks = Table(
        'availability_blocks', metadata,
        Column('id', Integer, primary_key=True),
        Column('calendar_id', Integer, ForeignKey('calendars.id', ondelete='CASCADE')),
        Column('day_of_week', Integer, nullable=False),
        Column('start_time', Time, nullable=False),
        Column('end_time', Time, nullable=False)
    )
    
    availability_slots = Table(
        'availability_slots', metadata,
        Column('id', Integer, primary_key=True),
        Column('calendar_id', Integer, ForeignKey('calendars.id', ondelete='CASCADE')),
        Column('date', Date, nullable=False),
        Column('start_time', Time, nullable=False),
        Column('end_time', Time, nullable=False),
        Column('is_available', Boolean, default=True)
    )
    
    appointments = Table(
        'appointments', metadata,
        Column('id', Integer, primary_key=True),
        Column('calendar_id', Integer, ForeignKey('calendars.id', ondelete='CASCADE')),
        Column('slot_id', Integer, ForeignKey('availability_slots.id', ondelete='CASCADE')),
        Column('client_name', String, nullable=False),
        Column('client_email', String, nullable=False),
        Column('date', Date, nullable=False),
        Column('start_time', Time, nullable=False),
        Column('end_time', Time, nullable=False),
        Column('status', String, nullable=False, default='pending'),
        Column('notes', String)
    )
    
    # Crear tablas
    metadata.create_all(engine)
    
    print("¡Tablas creadas exitosamente!")
    
    # Cerrar conexión
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")