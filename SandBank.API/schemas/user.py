from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class UserSchema(BaseModel):
    id: int
    username: str
    email: str
    role: str
    balance: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UpdateProfileSchema(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class UpdatePasswordSchema(BaseModel):
    current_password: str
    new_password: str