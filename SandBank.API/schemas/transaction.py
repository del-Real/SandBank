from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class TransactionSchema(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    amount: int
    description: str
    service_request_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)