from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class CreateCheckoutSchema(BaseModel):
    pack: str  # "starter" | "standard" | "pro"


class CheckoutResponseSchema(BaseModel):
    checkout_url: str  # Stripe hosted page URL — redirect frontend here


class PaymentSchema(BaseModel):
    id: int
    user_id: int
    stripe_session_id: str
    credits: int
    amount_eur: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
