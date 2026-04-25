from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CreateServiceRequestSchema(BaseModel):
    activity_id: int

class ServiceRequestSchema(BaseModel):
    id: int
    activity_id: int
    requester_id: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)