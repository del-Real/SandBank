from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.service_request import CreateServiceRequestSchema, ServiceRequestSchema
from services import request_service
from services.dependencies import get_current_user
from models.user import User

router = APIRouter(prefix="/api/requests", tags=["requests"])

@router.post("/", response_model=ServiceRequestSchema, status_code=201)
def create_request(
    data: CreateServiceRequestSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return request_service.create_request(db, data, current_user.id)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=list[ServiceRequestSchema])
def get_my_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return request_service.get_my_requests(db, current_user.id)

@router.get("/incoming", response_model=list[ServiceRequestSchema])
def get_incoming_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return request_service.get_incoming_requests(db, current_user.id)

@router.put("/{request_id}/accept", response_model=ServiceRequestSchema)
def accept_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return request_service.accept_request(db, request_id, current_user.id)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{request_id}/reject", response_model=ServiceRequestSchema)
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return request_service.reject_request(db, request_id, current_user.id)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{request_id}/cancel", response_model=ServiceRequestSchema)
def cancel_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return request_service.cancel_request(db, request_id, current_user.id)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{request_id}/complete", response_model=ServiceRequestSchema)
def complete_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return request_service.complete_request(db, request_id, current_user.id)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))