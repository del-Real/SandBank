from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from schemas.payment import CreateCheckoutSchema, CheckoutResponseSchema, PaymentSchema
from services import payment_service
from services.dependencies import get_current_user
from models.user import User

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.post("/checkout", response_model=CheckoutResponseSchema)
def create_checkout(
    data: CreateCheckoutSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        url = payment_service.create_checkout_session(db, current_user.id, data.pack)
        return CheckoutResponseSchema(checkout_url=url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Stripe sends raw bytes — do NOT use Depends(get_db) body parsing here
@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")
    try:
        payment_service.handle_webhook(db, payload, sig_header)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me", response_model=list[PaymentSchema])
def get_my_payments(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return payment_service.get_my_payments(db, current_user.id)
