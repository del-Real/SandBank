from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime


class CreateRatingSchema(BaseModel):
    service_request_id: int
    stars: int = Field(ge=1, le=5)
    review: Optional[str] = None


class RatingSchema(BaseModel):
    id: int
    service_request_id: int
    reviewer_id: int
    reviewee_id: int
    stars: int
    review: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
