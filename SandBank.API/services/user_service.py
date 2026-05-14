from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UpdateProfileSchema, UpdatePasswordSchema
import bcrypt

def get_all_users(db: Session):
    return db.query(User).all()

def get_user_by_id(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("User not found")
    return user

def update_profile(db: Session, current_user: User, data: UpdateProfileSchema):
    if data.username:
        current_user.username = data.username
    if data.email:
        existing = db.query(User).filter(User.email == data.email, User.id != current_user.id).first()
        if existing:
            raise Exception("Email already in use")
        current_user.email = data.email
    db.commit()
    db.refresh(current_user)
    return current_user

def update_password(db: Session, current_user: User, data: UpdatePasswordSchema):
    if not bcrypt.checkpw(data.current_password.encode("utf-8"), current_user.password_hash.encode("utf-8")):
        raise Exception("Current password is incorrect")
    current_user.password_hash = bcrypt.hashpw(data.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    db.commit()

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise Exception("User not found")
    db.delete(user)
    db.commit()