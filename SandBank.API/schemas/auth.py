from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class RegisterSchema(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)

class AuthResponseSchema(BaseModel):
    id: int          
    token: str
    username: str
    email: str
    role: str  
    expires_at: datetime