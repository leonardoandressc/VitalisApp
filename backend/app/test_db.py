from database import SessionLocal
# Test de conexión a la base de datos
try:
    db = SessionLocal()
    print("✅ Conexión a la base de datos exitosa.")
    db.close()
except Exception as e:
    print(f"❌ Error de conexión: {e}")