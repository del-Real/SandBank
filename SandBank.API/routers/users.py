from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.user import UserSchema, UpdateProfileSchema, UpdatePasswordSchema
from services import user_service
from services.dependencies import get_current_user, require_admin
from models.user import User

router = APIRouter(prefix="/api/users", tags=["users"])

# --- Profile (any logged in user) ---

@router.get("/me", response_model=UserSchema)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserSchema)
def update_my_profile(data: UpdateProfileSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return user_service.update_profile(db, current_user, data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/me/password", status_code=204)
def update_my_password(data: UpdatePasswordSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        user_service.update_password(db, current_user, data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me/balance")
def get_my_balance(current_user: User = Depends(get_current_user)):
    return {"balance": current_user.balance}

# --- Admin only ---

@router.get("/", response_model=list[UserSchema])
def get_all_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return user_service.get_all_users(db)

@router.get("/{user_id}", response_model=UserSchema)
def get_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    try:
        return user_service.get_user_by_id(db, user_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    try:
        user_service.delete_user(db, user_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
