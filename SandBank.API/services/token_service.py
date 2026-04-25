from datetime import datetime, timedelta, timezone
from jose import jwt
from config import settings
from models.user import User

def generate_token(user: User) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)

    claims = {
        "sub": str(user.id),
        "email": user.email,
        "unique_name": user.username,
        "exp": expires_at
    }

    return jwt.encode(claims, settings.secret_key, algorithm=settings.algorithm)