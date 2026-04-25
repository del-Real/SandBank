from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.transaction import TransactionSchema
from services import transaction_service
from services.dependencies import get_current_user
from models.user import User

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

@router.get("/me", response_model=list[TransactionSchema])
def get_my_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return transaction_service.get_my_transactions(db, current_user.id)