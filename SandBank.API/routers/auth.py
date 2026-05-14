from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import LoginSchema, RegisterSchema, AuthResponseSchema
from services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponseSchema, status_code=201)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    try:
        return auth_service.register(db, data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=AuthResponseSchema)
def login(data: LoginSchema, db: Session = Depends(get_db)):
    try:
        return auth_service.login(db, data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))