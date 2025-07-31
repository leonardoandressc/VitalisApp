from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./calendario.db")

# Crear el motor de base de datos SQLite
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Solo para SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Función para obtener la sesión de DB en FastAPI (dependencia)
def get_db():
    db = SessionLocal()
    try:
        # Verificar que la conexión funciona
        db.execute(text("SELECT 1"))
        yield db
    except Exception as e:
        print(f"Error de conexión a la base de datos: {e}")
        raise
    finally:
        db.close()
