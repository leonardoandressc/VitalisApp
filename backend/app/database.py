from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

if DB_PORT is None:
    raise ValueError("DB_PORT no está definido en .env")

DB_PORT = int(DB_PORT)  # Convertir a entero

# Usar parámetros directos en lugar de URL para evitar problemas de codificación
engine_params = {
    'host': DB_HOST,
    'port': DB_PORT,
    'username': DB_USER,
    'password': DB_PASSWORD,
    'database': DB_NAME
}

# Crear el motor de base de datos usando parámetros directos
engine = create_engine(
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
    connect_args={'client_encoding': 'utf8'}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Función para obtener la sesión de DB en FastAPI (dependencia)
def get_db():
    db = SessionLocal()
    try:
        # Verificar que la conexión funciona
        db.execute("SELECT 1")
        yield db
    except Exception as e:
        print(f"Error de conexión a la base de datos: {e}")
        raise
    finally:
        db.close()
