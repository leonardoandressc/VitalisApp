from app.database import SessionLocal, engine
from app.models.models import Specialty, SubSpecialty, Insurance, Service
import datetime

def seed_initial_data():
    db = SessionLocal()
    
    try:
        # Especialidades médicas comunes
        specialties_data = [
            {"name": "Medicina General", "description": "Atención médica integral y preventiva"},
            {"name": "Cardiología", "description": "Especialidad en enfermedades del corazón y sistema cardiovascular"},
            {"name": "Dermatología", "description": "Especialidad en enfermedades de la piel"},
            {"name": "Ginecología", "description": "Especialidad en salud femenina y reproductiva"},
            {"name": "Pediatría", "description": "Especialidad en atención médica infantil"},
            {"name": "Neurología", "description": "Especialidad en enfermedades del sistema nervioso"},
            {"name": "Ortopedia", "description": "Especialidad en huesos, articulaciones y músculos"},
            {"name": "Oftalmología", "description": "Especialidad en enfermedades de los ojos"},
            {"name": "Otorrinolaringología", "description": "Especialidad en oído, nariz y garganta"},
            {"name": "Psiquiatría", "description": "Especialidad en salud mental"},
            {"name": "Urología", "description": "Especialidad en sistema urinario y reproductivo masculino"},
            {"name": "Endocrinología", "description": "Especialidad en hormonas y metabolismo"},
            {"name": "Gastroenterología", "description": "Especialidad en sistema digestivo"},
            {"name": "Neumología", "description": "Especialidad en enfermedades respiratorias"},
            {"name": "Oncología", "description": "Especialidad en tratamiento del cáncer"}
        ]
        
        # Crear especialidades
        specialty_objects = {}
        for spec_data in specialties_data:
            existing = db.query(Specialty).filter(Specialty.name == spec_data["name"]).first()
            if not existing:
                specialty = Specialty(**spec_data)
                db.add(specialty)
                db.commit()
                db.refresh(specialty)
                specialty_objects[spec_data["name"]] = specialty
            else:
                specialty_objects[spec_data["name"]] = existing
        
        # Sub-especialidades
        sub_specialties_data = [
            {"name": "Cardiología Intervencionista", "specialty": "Cardiología"},
            {"name": "Electrofisiología", "specialty": "Cardiología"},
            {"name": "Dermatología Cosmética", "specialty": "Dermatología"},
            {"name": "Dermatología Oncológica", "specialty": "Dermatología"},
            {"name": "Ginecología Oncológica", "specialty": "Ginecología"},
            {"name": "Medicina Materno-Fetal", "specialty": "Ginecología"},
            {"name": "Neonatología", "specialty": "Pediatría"},
            {"name": "Pediatría de Urgencias", "specialty": "Pediatría"},
            {"name": "Neurología Pediátrica", "specialty": "Neurología"},
            {"name": "Neurocirugía", "specialty": "Neurología"},
            {"name": "Ortopedia Pediátrica", "specialty": "Ortopedia"},
            {"name": "Traumatología", "specialty": "Ortopedia"},
            {"name": "Retina y Vítreo", "specialty": "Oftalmología"},
            {"name": "Glaucoma", "specialty": "Oftalmología"}
        ]
        
        # Crear sub-especialidades
        for sub_spec_data in sub_specialties_data:
            specialty = specialty_objects.get(sub_spec_data["specialty"])
            if specialty:
                existing = db.query(SubSpecialty).filter(
                    SubSpecialty.name == sub_spec_data["name"],
                    SubSpecialty.specialty_id == specialty.id
                ).first()
                if not existing:
                    sub_specialty = SubSpecialty(
                        name=sub_spec_data["name"],
                        specialty_id=specialty.id
                    )
                    db.add(sub_specialty)
        
        db.commit()
        
        # Seguros médicos comunes en México
        insurances_data = [
            {"name": "IMSS", "description": "Instituto Mexicano del Seguro Social"},
            {"name": "ISSSTE", "description": "Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado"},
            {"name": "Seguro Popular", "description": "Sistema de Protección Social en Salud"},
            {"name": "GNP Seguros", "description": "Grupo Nacional Provincial"},
            {"name": "AXA Seguros", "description": "AXA Seguros México"},
            {"name": "Metlife", "description": "MetLife México"},
            {"name": "Zurich", "description": "Zurich Seguros México"},
            {"name": "Mapfre", "description": "Mapfre México"},
            {"name": "Allianz", "description": "Allianz México"},
            {"name": "Banorte Generali", "description": "Seguros Banorte Generali"},
            {"name": "Particular", "description": "Pacientes particulares sin seguro"}
        ]
        
        # Crear seguros
        for insurance_data in insurances_data:
            existing = db.query(Insurance).filter(Insurance.name == insurance_data["name"]).first()
            if not existing:
                insurance = Insurance(**insurance_data)
                db.add(insurance)
        
        db.commit()
        
        # Servicios médicos comunes
        services_data = [
            {"name": "Consulta General", "description": "Consulta médica general", "duration": 30},
            {"name": "Consulta de Seguimiento", "description": "Consulta de control y seguimiento", "duration": 20},
            {"name": "Consulta de Primera Vez", "description": "Primera consulta con el especialista", "duration": 45},
            {"name": "Electrocardiograma", "description": "Estudio del ritmo cardíaco", "duration": 15},
            {"name": "Ultrasonido", "description": "Estudio de ultrasonido", "duration": 30},
            {"name": "Rayos X", "description": "Estudio radiológico", "duration": 15},
            {"name": "Análisis de Laboratorio", "description": "Toma de muestras para laboratorio", "duration": 10},
            {"name": "Curaciones", "description": "Curación de heridas", "duration": 20},
            {"name": "Inyecciones", "description": "Aplicación de medicamentos", "duration": 10},
            {"name": "Toma de Presión", "description": "Medición de presión arterial", "duration": 5},
            {"name": "Consulta Nutricional", "description": "Asesoría nutricional", "duration": 45},
            {"name": "Terapia Física", "description": "Sesión de fisioterapia", "duration": 60},
            {"name": "Consulta Psicológica", "description": "Sesión de psicología", "duration": 50},
            {"name": "Procedimiento Menor", "description": "Procedimientos ambulatorios menores", "duration": 30},
            {"name": "Cirugía Menor", "description": "Cirugías ambulatorias menores", "duration": 60}
        ]
        
        # Crear servicios
        for service_data in services_data:
            existing = db.query(Service).filter(Service.name == service_data["name"]).first()
            if not existing:
                service = Service(**service_data)
                db.add(service)
        
        db.commit()
        print("Datos iniciales agregados exitosamente")
        
    except Exception as e:
        print(f"Error al agregar datos iniciales: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_initial_data()