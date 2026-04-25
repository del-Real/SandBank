from sqlalchemy.orm import Session
import bcrypt
from datetime import datetime, timedelta, timezone
from models.user import User
from schemas.auth import RegisterSchema, LoginSchema, AuthResponseSchema
from services.token_service import generate_token

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def register(db: Session, data: RegisterSchema) -> AuthResponseSchema:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise Exception("User already exists")

    new_user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = generate_token(new_user)

    return AuthResponseSchema(
        id=new_user.id, 
        token=token,
        username=new_user.username,
        email=new_user.email,
        role=new_user.role,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=60)
    )

def login(db: Session, data: LoginSchema) -> AuthResponseSchema:
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise Exception("User not found")

    if not verify_password(data.password, user.password_hash):
        raise Exception("Password not valid")

    token = generate_token(user)

    return AuthResponseSchema(
        id=user.id,
        token=token,
        username=user.username,
        email=user.email,
        role=user.role,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=60)
    )