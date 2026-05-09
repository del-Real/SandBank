from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.user import UserSchema
from schemas.activity import ActivitySchema
from schemas.transaction import TransactionSchema
from services import admin_service
from services.dependencies import require_admin
from models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin", tags=["admin"])


class SetActiveSchema(BaseModel):
    is_active: bool


class SetVisibleSchema(BaseModel):
    is_visible: bool


class SetRoleSchema(BaseModel):
    role: str


# ── Stats ────────────────────────────────────────────


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return admin_service.get_stats(db)


# ── Users ────────────────────────────────────────────


@router.get("/users", response_model=list[UserSchema])
def get_all_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return admin_service.get_all_users(db)


@router.put("/users/{user_id}/active", response_model=UserSchema)
def set_user_active(
    user_id: int,
    data: SetActiveSchema,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    try:
        return admin_service.set_user_active(db, user_id, data.is_active)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/users/{user_id}/role", response_model=UserSchema)
def set_user_role(
    user_id: int,
    data: SetRoleSchema,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    try:
        return admin_service.set_user_role(db, user_id, data.role)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Activities ───────────────────────────────────────


@router.get("/activities", response_model=list[ActivitySchema])
def get_all_activities(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return admin_service.get_all_activities(db)


@router.put("/activities/{activity_id}/visible", response_model=ActivitySchema)
def set_activity_visible(
    activity_id: int,
    data: SetVisibleSchema,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    try:
        return admin_service.set_activity_visible(db, activity_id, data.is_visible)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/activities/{activity_id}", status_code=204)
def delete_activity(
    activity_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)
):
    try:
        admin_service.delete_activity(db, activity_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# ── Transactions ─────────────────────────────────────


@router.get("/transactions", response_model=list[TransactionSchema])
def get_all_transactions(
    db: Session = Depends(get_db), _: User = Depends(require_admin)
):
    return admin_service.get_all_transactions(db)
