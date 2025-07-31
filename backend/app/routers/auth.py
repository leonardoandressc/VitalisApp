from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from typing import Optional
import random
import string
import requests
import json
from ..database import get_db
from ..models.models import User
from ..schemas.schemas import UserRegister, UserRead
from ..utils.token_utils import authenticate_user, create_access_token
from ..utils.password_utils import hash_password
from ..utils.email_utils import send_verification_email, send_welcome_email
from ..config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

@router.post("/register", response_model=UserRead)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Generar código de verificación
    verification_code = generate_verification_code()
    
    # Crear nuevo usuario
    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        is_verified=False,
        verification_code=verification_code
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Email temporalmente deshabilitado - mostrar código en consola
    print(f"Código de verificación para {user_data.email}: {verification_code}")
    print(f"Email: {user_data.email} - Usuario: {user_data.first_name} {user_data.last_name}")
    
    return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contraseña incorrectos")

    # Token estándar
    access_token = create_access_token(data={"sub": user.email})
    
    # Crear token de refresco con duración más larga
    refresh_token = create_access_token(
        data={"sub": user.email, "refresh": True},
        expires_delta=timedelta(days=30)  # 30 días para el refresh token
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "is_verified": user.is_verified
        }
    }

@router.post("/login/json")
def login_json(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Correo o contraseña incorrectos")

    # Token de acceso estándar
    access_token = create_access_token(data={"sub": user.email})
    
    # Si remember_me está activado, crear un refresh token de larga duración
    refresh_expires = timedelta(days=30) if login_data.remember_me else timedelta(hours=24)
    refresh_token = create_access_token(
        data={"sub": user.email, "refresh": True},
        expires_delta=refresh_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "is_verified": user.is_verified
        }
    }

@router.post("/refresh")
def refresh_token(refresh_token: str = Body(..., embed=True), db: Session = Depends(get_db)):
    # Aquí iría la lógica para validar el refresh token y generar un nuevo access token
    # Por simplicidad, no implementamos la validación completa
    
    # Generar nuevo access token
    new_access_token = create_access_token(data={"sub": "user@example.com"})
    
    return {"access_token": new_access_token, "token_type": "bearer"}

class VerifyEmailRequest(BaseModel):
    email: str
    code: str

@router.post("/verify-email")
def verify_email(verify_data: VerifyEmailRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == verify_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if user.verification_code != verify_data.code:
        raise HTTPException(status_code=400, detail="Código de verificación inválido")
    
    # Marcar como verificado
    user.is_verified = True
    user.verification_code = None
    db.commit()
    
    # Email de bienvenida temporalmente deshabilitado
    print(f"Usuario verificado exitosamente: {user.email}")
    
    return {"message": "Email verificado exitosamente"}

class ResendCodeRequest(BaseModel):
    email: str

class GoogleLoginRequest(BaseModel):
    id_token: str

@router.post("/resend-verification")
def resend_verification_code(resend_data: ResendCodeRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == resend_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if user.is_verified:
        raise HTTPException(status_code=400, detail="El usuario ya está verificado")
    
    # Generar nuevo código
    new_code = generate_verification_code()
    user.verification_code = new_code
    db.commit()
    
    # Email temporalmente deshabilitado - mostrar código en consola
    print(f"Nuevo código de verificación para {resend_data.email}: {new_code}")
    print(f"Usuario: {user.first_name} {user.last_name}")
    
    return {"message": "Código de verificación reenviado"}

@router.post("/google")
def google_login(google_data: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        # Verificar el token de Google
        response = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={google_data.id_token}"
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Token de Google inválido")
        
        google_user_info = response.json()
        email = google_user_info.get("email")
        first_name = google_user_info.get("given_name", "")
        last_name = google_user_info.get("family_name", "")
        
        if not email:
            raise HTTPException(status_code=400, detail="No se pudo obtener el email de Google")
        
        # Buscar usuario existente
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Crear nuevo usuario
            user = User(
                first_name=first_name,
                last_name=last_name,
                email=email,
                hashed_password="",  # No password for Google users
                is_verified=True,  # Google users are pre-verified
                verification_code=None
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Si el usuario existe pero no está verificado, verificarlo
            if not user.is_verified:
                user.is_verified = True
                user.verification_code = None
                db.commit()
        
        # Crear tokens
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_access_token(
            data={"sub": user.email, "refresh": True},
            expires_delta=timedelta(days=30)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "refresh_token": refresh_token,
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "is_verified": user.is_verified
            }
        }
        
    except requests.RequestException:
        raise HTTPException(status_code=400, detail="Error al verificar token de Google")
    except Exception as e:
        print(f"Error en Google login: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")
