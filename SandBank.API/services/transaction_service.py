from sqlalchemy.orm import Session
from models.transaction import Transaction

def get_my_transactions(db: Session, current_user_id: int):
    return db.query(Transaction).filter(
        (Transaction.sender_id == current_user_id) |
        (Transaction.receiver_id == current_user_id)
    ).order_by(Transaction.created_at.desc()).all()