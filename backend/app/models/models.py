from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Time, Date, Text
from sqlalchemy import Column, Enum as SQLEnum, Table
from sqlalchemy.orm import relationship
from ..database import Base
from enum import Enum
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)
    profile_completed = Column(Boolean, default=False)

    calendars = relationship("Calendar", back_populates="owner")
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)


class Calendar(Base):
    __tablename__ = "calendars"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    slug = Column(String, unique=True, index=True)  # Custom URL
    meeting_duration = Column(Integer, default=60)  # en minutos
    slot_interval = Column(Integer, default=60)  # en minutos
    buffer_before = Column(Integer)
    buffer_after = Column(Integer)
    max_per_day = Column(Integer)
    max_per_slot = Column(Integer)



    owner = relationship("User", back_populates="calendars")
    availability_slots = relationship("AvailabilitySlot", back_populates="calendar")
    appointments = relationship("Appointment", back_populates="calendar")
    availability_blocks = relationship("AvailabilityBlock", back_populates="calendar", cascade="all, delete-orphan")



class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"

    id = Column(Integer, primary_key=True, index=True)
    calendar_id = Column(Integer, ForeignKey("calendars.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    is_booked = Column(Boolean, default=False)

    calendar = relationship("Calendar", back_populates="availability_slots")


class WeekDay(str, Enum):
    monday = "mon"
    tuesday = "tue"
    wednesday = "wed"
    thursday = "thu"
    friday = "fri"
    saturday = "sat"
    sunday = "sun"

class AvailabilityBlock(Base):
    __tablename__ = "availability_blocks"

    id = Column(Integer, primary_key=True, index=True)
    calendar_id = Column(Integer, ForeignKey("calendars.id"), nullable=False)
    day_of_week = Column(SQLEnum(WeekDay), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    calendar = relationship("Calendar", back_populates="availability_blocks")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    calendar_id = Column(Integer, ForeignKey("calendars.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    description = Column(String)

    calendar = relationship("Calendar", back_populates="appointments")


# Tabla de asociación para la relación many-to-many entre DoctorProfile y Service
doctor_services = Table(
    'doctor_services',
    Base.metadata,
    Column('doctor_profile_id', Integer, ForeignKey('doctor_profiles.id'), primary_key=True),
    Column('service_id', Integer, ForeignKey('services.id'), primary_key=True)
)

# Tabla de asociación para la relación many-to-many entre DoctorProfile y Insurance
doctor_insurances = Table(
    'doctor_insurances',
    Base.metadata,
    Column('doctor_profile_id', Integer, ForeignKey('doctor_profiles.id'), primary_key=True),
    Column('insurance_id', Integer, ForeignKey('insurances.id'), primary_key=True)
)


class Specialty(Base):
    __tablename__ = "specialties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sub_specialties = relationship("SubSpecialty", back_populates="specialty")
    doctor_profiles = relationship("DoctorProfile", back_populates="specialty")


class SubSpecialty(Base):
    __tablename__ = "sub_specialties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty_id = Column(Integer, ForeignKey("specialties.id"))
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    specialty = relationship("Specialty", back_populates="sub_specialties")
    doctor_profiles = relationship("DoctorProfile", back_populates="sub_specialty")


class Insurance(Base):
    __tablename__ = "insurances"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    doctor_profiles = relationship("DoctorProfile", secondary=doctor_insurances, back_populates="insurances")


class Clinic(Base):
    __tablename__ = "clinics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(Text, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    doctor_profiles = relationship("DoctorProfile", back_populates="clinic")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    price = Column(String, nullable=True)  # Precio como string para flexibilidad
    duration = Column(Integer, nullable=True)  # Duración en minutos
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    doctor_profiles = relationship("DoctorProfile", secondary=doctor_services, back_populates="services")


class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Campos obligatorios
    professional_license = Column(String, nullable=False, index=True)  # Cédula profesional
    phone = Column(String, nullable=False)
    
    # Campos opcionales
    specialty_license = Column(String, nullable=True)  # Cédula de especialidad
    office = Column(String, nullable=True)  # Consultorio
    emergency_contact = Column(String, nullable=True)  # Urgencias
    website = Column(String, nullable=True)  # Página web
    
    # Relaciones
    specialty_id = Column(Integer, ForeignKey("specialties.id"), nullable=True)
    sub_specialty_id = Column(Integer, ForeignKey("sub_specialties.id"), nullable=True)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=True)
    
    # Campo de verificación
    is_verified = Column(Boolean, default=False)
    verification_notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(String, nullable=True)  # Admin que verificó
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relaciones
    user = relationship("User", back_populates="doctor_profile")
    specialty = relationship("Specialty", back_populates="doctor_profiles")
    sub_specialty = relationship("SubSpecialty", back_populates="doctor_profiles")
    clinic = relationship("Clinic", back_populates="doctor_profiles")
    services = relationship("Service", secondary=doctor_services, back_populates="doctor_profiles")
    insurances = relationship("Insurance", secondary=doctor_insurances, back_populates="doctor_profiles")
