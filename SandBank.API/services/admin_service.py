from sqlalchemy.orm import Session
from sqlalchemy import func
from models.user import User
from models.activity import Activity
from models.transaction import Transaction
from models.payment import Payment

# ── Users ────────────────────────────────────────────


def get_all_users(db: Session):
    return db.query(User).order_by(User.created_at.desc()).all()


def set_user_active(db: Session, user_id: int, is_active: bool) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("User not found")
    user.is_active = is_active
    db.commit()
    db.refresh(user)
    return user


def set_user_role(db: Session, user_id: int, role: str) -> User:
    if role not in ("Admin", "User"):
        raise Exception("Role must be 'Admin' or 'User'")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("User not found")
    user.role = role
    db.commit()
    db.refresh(user)
    return user


# ── Activities ───────────────────────────────────────


def get_all_activities(db: Session):
    return db.query(Activity).order_by(Activity.created_at.desc()).all()


def set_activity_visible(db: Session, activity_id: int, is_visible: bool) -> Activity:
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise Exception("Activity not found")
    activity.is_visible = is_visible
    db.commit()
    db.refresh(activity)
    return activity


def delete_activity(db: Session, activity_id: int):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise Exception("Activity not found")
    db.delete(activity)
    db.commit()


# ── Transactions ─────────────────────────────────────


def get_all_transactions(db: Session):
    return db.query(Transaction).order_by(Transaction.created_at.desc()).all()


# ── Stats ────────────────────────────────────────────


def get_stats(db: Session) -> dict:
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    total_activities = db.query(func.count(Activity.id)).scalar()
    visible_activities = (
        db.query(func.count(Activity.id)).filter(Activity.is_visible == True).scalar()
    )
    total_transactions = db.query(func.count(Transaction.id)).scalar()
    total_credits_in_circulation = db.query(func.sum(User.balance)).scalar() or 0
    total_payments = (
        db.query(func.count(Payment.id)).filter(Payment.status == "completed").scalar()
    )

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_activities": total_activities,
        "visible_activities": visible_activities,
        "total_transactions": total_transactions,
        "total_credits_in_circulation": total_credits_in_circulation,
        "total_payments": total_payments,
    }
