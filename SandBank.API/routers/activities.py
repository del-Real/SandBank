from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from schemas.activity import CreateActivitySchema, UpdateActivitySchema, ActivitySchema
from services import activity_service
from services.dependencies import get_current_user, require_admin
from models.user import User

router = APIRouter(prefix="/api/activities", tags=["activities"])

@router.get("/", response_model=list[ActivitySchema])
def get_all_activities(
    title: Optional[str] = None,
    max_duration: Optional[int] = None,
    db: Session = Depends(get_db)
):
    return activity_service.get_all_activities(db, title, max_duration)

@router.get("/{activity_id}", response_model=ActivitySchema)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    try:
        return activity_service.get_activity_by_id(db, activity_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/", response_model=ActivitySchema, status_code=201)
def create_activity(
    data: CreateActivitySchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return activity_service.create_activity(db, data, current_user.id)

@router.put("/{activity_id}", response_model=ActivitySchema)
def update_activity(
    activity_id: int,
    data: UpdateActivitySchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return activity_service.update_activity(db, activity_id, data, current_user.id)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{activity_id}", status_code=204)
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        activity_service.delete_activity(db, activity_id, current_user.id, current_user.role)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))