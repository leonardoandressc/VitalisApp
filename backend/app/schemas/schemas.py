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