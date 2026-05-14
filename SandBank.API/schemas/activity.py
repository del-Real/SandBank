from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class CreateActivitySchema(BaseModel):
    title: str
    description: str
    duration: int  # hours = credits
    start_date: datetime


class UpdateActivitySchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    start_date: Optional[datetime] = None


class ActivitySchema(BaseModel):
    id: int
    title: str
    description: str
    duration: int
    start_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner_id: int
    is_visible: bool

    model_config = ConfigDict(from_attributes=True)
