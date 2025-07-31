from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.models import (
    User, DoctorProfile, Specialty, SubSpecialty, 
    Insurance, Clinic, Service, doctor_services, doctor_insurances
)
from ..schemas.schemas import (
    DoctorProfileCreate, DoctorProfileRead, DoctorProfileUpdate,
    SpecialtyCreate, SpecialtyRead, SpecialtySuggestion,
    SubSpecialtyCreate, SubSpecialtyRead, SubSpecialtySuggestion,
    InsuranceCreate, InsuranceRead, InsuranceSuggestion,
    ClinicCreate, ClinicRead, ClinicSuggestion,
    ServiceCreate, ServiceRead, ServiceSuggestion,
    ProfileVerificationUpdate
)
from ..utils.auth import get_current_user
from sqlalchemy import or_

router = APIRouter(prefix="/doctor-profile", tags=["doctor-profile"])


# Endpoints para DoctorProfile
@router.post("/", response_model=DoctorProfileRead)
def create_doctor_profile(
    profile_data: DoctorProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear perfil profesional del doctor"""
    # Verificar si ya tiene un perfil
    existing_profile = db.query(DoctorProfile).filter(
        DoctorProfile.user_id == current_user.id
    ).first()
    
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya tiene un perfil profesional"
        )
    
    # Crear el perfil
    db_profile = DoctorProfile(
        user_id=current_user.id,
        professional_license=profile_data.professional_license,
        phone=profile_data.phone,
        specialty_license=profile_data.specialty_license,
        office=profile_data.office,
        emergency_contact=profile_data.emergency_contact,
        website=profile_data.website,
        specialty_id=profile_data.specialty_id,
        sub_specialty_id=profile_data.sub_specialty_id,
        clinic_id=profile_data.clinic_id
    )
    
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    
    # Agregar servicios
    if profile_data.service_ids:
        services = db.query(Service).filter(Service.id.in_(profile_data.service_ids)).all()
        db_profile.services.extend(services)
    
    # Agregar seguros
    if profile_data.insurance_ids:
        insurances = db.query(Insurance).filter(Insurance.id.in_(profile_data.insurance_ids)).all()
        db_profile.insurances.extend(insurances)
    
    db.commit()
    
    # Marcar perfil como completado
    current_user.profile_completed = True
    db.commit()
    
    return db_profile


@router.get("/me", response_model=DoctorProfileRead)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener perfil profesional del usuario actual"""
    profile = db.query(DoctorProfile).filter(
        DoctorProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil profesional no encontrado"
        )
    
    return profile


@router.put("/me", response_model=DoctorProfileRead)
def update_my_profile(
    profile_data: DoctorProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Actualizar perfil profesional del usuario actual"""
    profile = db.query(DoctorProfile).filter(
        DoctorProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil profesional no encontrado"
        )
    
    # Actualizar campos
    update_data = profile_data.dict(exclude_unset=True)
    service_ids = update_data.pop('service_ids', None)
    insurance_ids = update_data.pop('insurance_ids', None)
    
    for field, value in update_data.items():
        setattr(profile, field, value)
    
    # Actualizar servicios
    if service_ids is not None:
        profile.services.clear()
        if service_ids:
            services = db.query(Service).filter(Service.id.in_(service_ids)).all()
            profile.services.extend(services)
    
    # Actualizar seguros
    if insurance_ids is not None:
        profile.insurances.clear()
        if insurance_ids:
            insurances = db.query(Insurance).filter(Insurance.id.in_(insurance_ids)).all()
            profile.insurances.extend(insurances)
    
    db.commit()
    db.refresh(profile)
    
    return profile


# Endpoints para Specialties
@router.get("/specialties", response_model=SpecialtySuggestion)
def get_specialties(
    search: Optional[str] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obtener lista de especialidades con búsqueda opcional"""
    query = db.query(Specialty)
    
    if search:
        query = query.filter(
            or_(
                Specialty.name.ilike(f"%{search}%"),
                Specialty.description.ilike(f"%{search}%")
            )
        )
    
    specialties = query.limit(limit).all()
    return {"specialties": specialties}


@router.post("/specialties", response_model=SpecialtyRead)
def create_specialty(
    specialty_data: SpecialtyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nueva especialidad"""
    # Verificar si ya existe
    existing = db.query(Specialty).filter(
        Specialty.name.ilike(specialty_data.name)
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La especialidad ya existe"
        )
    
    db_specialty = Specialty(**specialty_data.dict())
    db.add(db_specialty)
    db.commit()
    db.refresh(db_specialty)
    
    return db_specialty


# Endpoints para SubSpecialties
@router.get("/sub-specialties", response_model=SubSpecialtySuggestion)
def get_sub_specialties(
    specialty_id: Optional[int] = None,
    search: Optional[str] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obtener lista de sub-especialidades con filtros opcionales"""
    query = db.query(SubSpecialty)
    
    if specialty_id:
        query = query.filter(SubSpecialty.specialty_id == specialty_id)
    
    if search:
        query = query.filter(
            or_(
                SubSpecialty.name.ilike(f"%{search}%"),
                SubSpecialty.description.ilike(f"%{search}%")
            )
        )
    
    sub_specialties = query.limit(limit).all()
    return {"sub_specialties": sub_specialties}


@router.post("/sub-specialties", response_model=SubSpecialtyRead)
def create_sub_specialty(
    sub_specialty_data: SubSpecialtyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nueva sub-especialidad"""
    db_sub_specialty = SubSpecialty(**sub_specialty_data.dict())
    db.add(db_sub_specialty)
    db.commit()
    db.refresh(db_sub_specialty)
    
    return db_sub_specialty


# Endpoints para Insurance
@router.get("/insurances", response_model=InsuranceSuggestion)
def get_insurances(
    search: Optional[str] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obtener lista de seguros con búsqueda opcional"""
    query = db.query(Insurance)
    
    if search:
        query = query.filter(
            or_(
                Insurance.name.ilike(f"%{search}%"),
                Insurance.description.ilike(f"%{search}%")
            )
        )
    
    insurances = query.limit(limit).all()
    return {"insurances": insurances}


@router.post("/insurances", response_model=InsuranceRead)
def create_insurance(
    insurance_data: InsuranceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo seguro"""
    # Verificar si ya existe
    existing = db.query(Insurance).filter(
        Insurance.name.ilike(insurance_data.name)
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El seguro ya existe"
        )
    
    db_insurance = Insurance(**insurance_data.dict())
    db.add(db_insurance)
    db.commit()
    db.refresh(db_insurance)
    
    return db_insurance


# Endpoints para Clinics
@router.get("/clinics", response_model=ClinicSuggestion)
def get_clinics(
    search: Optional[str] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obtener lista de clínicas con búsqueda opcional"""
    query = db.query(Clinic)
    
    if search:
        query = query.filter(
            or_(
                Clinic.name.ilike(f"%{search}%"),
                Clinic.address.ilike(f"%{search}%")
            )
        )
    
    clinics = query.limit(limit).all()
    return {"clinics": clinics}


@router.post("/clinics", response_model=ClinicRead)
def create_clinic(
    clinic_data: ClinicCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nueva clínica"""
    db_clinic = Clinic(**clinic_data.dict())
    db.add(db_clinic)
    db.commit()
    db.refresh(db_clinic)
    
    return db_clinic


# Endpoints para Services
@router.get("/services", response_model=ServiceSuggestion)
def get_services(
    search: Optional[str] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Obtener lista de servicios con búsqueda opcional"""
    query = db.query(Service)
    
    if search:
        query = query.filter(
            or_(
                Service.name.ilike(f"%{search}%"),
                Service.description.ilike(f"%{search}%")
            )
        )
    
    services = query.limit(limit).all()
    return {"services": services}


@router.post("/services", response_model=ServiceRead)
def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo servicio"""
    db_service = Service(**service_data.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    
    return db_service


# Endpoint para verificar si el usuario tiene perfil completo
@router.get("/profile-status")
def get_profile_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Verificar si el usuario tiene perfil profesional completo"""
    profile = db.query(DoctorProfile).filter(
        DoctorProfile.user_id == current_user.id
    ).first()
    
    return {
        "has_profile": profile is not None,
        "profile_completed": current_user.profile_completed,
        "is_verified": profile.is_verified if profile else False
    }