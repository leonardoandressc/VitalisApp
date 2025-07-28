from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Time, Date
from sqlalchemy import Column, Enum as SQLEnum
from sqlalchemy.orm import relationship
from backend.app.database import Base
from enum import Enum
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    calendars = relationship("Calendar", back_populates="owner")


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
    availability_blocks = relationship("AvailabilityBlock", back_populates="calendar", cascade="all, delete")
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
