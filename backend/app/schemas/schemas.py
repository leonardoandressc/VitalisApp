from pydantic import BaseModel, EmailStr
from datetime import datetime, time
from typing import Optional, List, Literal
from enum import Enum

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    is_verified: bool

    class Config:
        from_attributes = True

class CalendarCreate(BaseModel):
    name: str
    description: Optional[str] = None

class CalendarRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class AvailabilitySlotBase(BaseModel):
    start_time: datetime
    end_time: datetime
    is_booked: Optional[bool] = False

class AvailabilitySlotCreate(AvailabilitySlotBase):
    calendar_id: int

class AvailabilitySlotRead(AvailabilitySlotBase):
    id: int
    calendar_id: int

    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    start_time: datetime
    end_time: datetime
    calendar_id: int
    user_id: int  # paciente o quien hizo la cita
    description: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentRead(AppointmentBase):
    id: int

    class Config:
        from_attributes = True

class WeeklyAvailabilityCreate(BaseModel):
    day_of_week: str  # Ej: "monday"
    start_time: time
    end_time: time

class AvailabilitySlotOut(BaseModel):
    id: int
    calendar_id: int
    start_time: datetime
    end_time: datetime
    is_booked: bool

    class Config:
        from_attributes = True

class WeekDay(str, Enum):
    mon = "mon"
    tue = "tue"
    wed = "wed"
    thu = "thu"
    fri = "fri"
    sat = "sat"
    sun = "sun"

class AvailabilityBlockBase(BaseModel):
    day_of_week: WeekDay
    start_time: time
    end_time: time

class AvailabilityBlockCreate(AvailabilityBlockBase):
    pass

class AvailabilityBlockOut(AvailabilityBlockBase):
    id: int

    class Config:
        from_attributes = True

class AvailabilityBlockCreate(BaseModel):
    day_of_week: Literal["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    start_time: time
    end_time: time

class AvailabilityBlockOut(AvailabilityBlockCreate):
    id: int
    calendar_id: int

    class Config:
        from_attributes = True


# Esquemas para Specialty
class SpecialtyBase(BaseModel):
    name: str
    description: Optional[str] = None

class SpecialtyCreate(SpecialtyBase):
    pass

class SpecialtyRead(SpecialtyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Esquemas para SubSpecialty
class SubSpecialtyBase(BaseModel):
    name: str
    specialty_id: int
    description: Optional[str] = None

class SubSpecialtyCreate(SubSpecialtyBase):
    pass

class SubSpecialtyRead(SubSpecialtyBase):
    id: int
    created_at: datetime
    specialty: Optional[SpecialtyRead] = None

    class Config:
        from_attributes = True


# Esquemas para Insurance
class InsuranceBase(BaseModel):
    name: str
    description: Optional[str] = None

class InsuranceCreate(InsuranceBase):
    pass

class InsuranceRead(InsuranceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Esquemas para Clinic
class ClinicBase(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class ClinicCreate(ClinicBase):
    pass

class ClinicRead(ClinicBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Esquemas para Service
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[str] = None
    duration: Optional[int] = None  # en minutos

class ServiceCreate(ServiceBase):
    pass

class ServiceRead(ServiceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Esquemas para DoctorProfile
class DoctorProfileBase(BaseModel):
    professional_license: str
    phone: str
    specialty_license: Optional[str] = None
    office: Optional[str] = None
    emergency_contact: Optional[str] = None
    website: Optional[str] = None
    specialty_id: Optional[int] = None
    sub_specialty_id: Optional[int] = None
    clinic_id: Optional[int] = None

class DoctorProfileCreate(DoctorProfileBase):
    service_ids: Optional[List[int]] = []
    insurance_ids: Optional[List[int]] = []

class DoctorProfileUpdate(BaseModel):
    professional_license: Optional[str] = None
    phone: Optional[str] = None
    specialty_license: Optional[str] = None
    office: Optional[str] = None
    emergency_contact: Optional[str] = None
    website: Optional[str] = None
    specialty_id: Optional[int] = None
    sub_specialty_id: Optional[int] = None
    clinic_id: Optional[int] = None
    service_ids: Optional[List[int]] = None
    insurance_ids: Optional[List[int]] = None

class DoctorProfileRead(DoctorProfileBase):
    id: int
    user_id: int
    is_verified: bool
    verification_notes: Optional[str] = None
    verified_at: Optional[datetime] = None
    verified_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # Relaciones
    specialty: Optional[SpecialtyRead] = None
    sub_specialty: Optional[SubSpecialtyRead] = None
    clinic: Optional[ClinicRead] = None
    services: List[ServiceRead] = []
    insurances: List[InsuranceRead] = []

    class Config:
        from_attributes = True


# Esquemas para verificación de perfil
class ProfileVerificationUpdate(BaseModel):
    is_verified: bool
    verification_notes: Optional[str] = None
    verified_by: str


# Esquemas para respuestas de sugerencias
class SpecialtySuggestion(BaseModel):
    specialties: List[SpecialtyRead]

class SubSpecialtySuggestion(BaseModel):
    sub_specialties: List[SubSpecialtyRead]

class InsuranceSuggestion(BaseModel):
    insurances: List[InsuranceRead]

class ServiceSuggestion(BaseModel):
    services: List[ServiceRead]

class ClinicSuggestion(BaseModel):
    clinics: List[ClinicRead]