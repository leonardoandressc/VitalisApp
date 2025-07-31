import psycopg2
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

print(f"Conectando a la base de datos {DB_NAME} en {DB_HOST}:{DB_PORT}...")

try:
    # Conectar directamente a PostgreSQL con codificación específica
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        client_encoding='utf8'
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    print("Conexión exitosa. Eliminando tablas si existen...")
    
    # Eliminar tablas en orden correcto (respetando restricciones de clave foránea)
    cursor.execute("""
    DROP TABLE IF EXISTS appointments CASCADE;
    DROP TABLE IF EXISTS availability_slots CASCADE;
    DROP TABLE IF EXISTS availability_blocks CASCADE;
    DROP TABLE IF EXISTS calendars CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    """)
    
    print("Tablas eliminadas. Creando tablas nuevas...")
    
    # Crear tablas en orden correcto
    cursor.execute("""
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        hashed_password VARCHAR NOT NULL
    );
    
    CREATE TABLE calendars (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        description VARCHAR,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );
    
    CREATE TABLE availability_blocks (
        id SERIAL PRIMARY KEY,
        calendar_id INTEGER REFERENCES calendars(id) ON DELETE CASCADE,
        day_of_week INTEGER NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL
    );
    
    CREATE TABLE availability_slots (
        id SERIAL PRIMARY KEY,
        calendar_id INTEGER REFERENCES calendars(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_available BOOLEAN DEFAULT TRUE
    );
    
    CREATE TABLE appointments (
        id SERIAL PRIMARY KEY,
        calendar_id INTEGER REFERENCES calendars(id) ON DELETE CASCADE,
        slot_id INTEGER REFERENCES availability_slots(id) ON DELETE CASCADE,
        client_name VARCHAR NOT NULL,
        client_email VARCHAR NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR NOT NULL DEFAULT 'pending',
        notes VARCHAR
    );
    """)
    
    print("¡Tablas creadas exitosamente!")
    
    # Cerrar conexión
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")