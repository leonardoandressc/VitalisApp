from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..utils.token_utils import authenticate_user, create_access_token
from ..config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

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
            "name": user.name,
            "email": user.email
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
            "name": user.name,
            "email": user.email
        }
    }

@router.post("/refresh")
def refresh_token(refresh_token: str = Body(..., embed=True), db: Session = Depends(get_db)):
    # Aquí iría la lógica para validar el refresh token y generar un nuevo access token
    # Por simplicidad, no implementamos la validación completa
    
    # Generar nuevo access token
    new_access_token = create_access_token(data={"sub": "user@example.com"})
    
    return {"access_token": new_access_token, "token_type": "bearer"}
