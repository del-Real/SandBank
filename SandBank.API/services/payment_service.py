import stripe
from sqlalchemy.orm import Session
from models.payment import Payment
from models.user import User
from models.transaction import Transaction
from config import settings
from datetime import datetime

stripe.api_key = settings.stripe_secret_key

# Credit packs definition
PACKS = {
    "starter": {"credits": 10, "amount_eur": 500, "label": "10 Credits - €5"},
    "standard": {"credits": 25, "amount_eur": 1000, "label": "25 Credits - €10"},
    "pro": {"credits": 60, "amount_eur": 2000, "label": "60 Credits - €20"},
}


def create_checkout_session(db: Session, user_id: int, pack: str) -> str:
    if pack not in PACKS:
        raise Exception(f"Invalid pack. Choose from: {', '.join(PACKS.keys())}")

    selected = PACKS[pack]

    # Create Stripe Checkout Session
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[
            {
                "price_data": {
                    "currency": "eur",
                    "unit_amount": selected["amount_eur"],
                    "product_data": {
                        "name": f"SandBank Credits — {selected['label']}",
                    },
                },
                "quantity": 1,
            }
        ],
        mode="payment",
        success_url="http://localhost:5173/credits?status=success",
        cancel_url="http://localhost:5173/credits?status=cancelled",
        metadata={
            "user_id": str(user_id),
            "credits": str(selected["credits"]),
            "pack": pack,
        },
    )

    # Store pending payment record
    payment = Payment(
        user_id=user_id,
        stripe_session_id=session.id,
        credits=selected["credits"],
        amount_eur=selected["amount_eur"],
        status="pending",
    )
    db.add(payment)
    db.commit()

    return session.url


def handle_webhook(db: Session, payload: bytes, sig_header: str):
    # Verify webhook came from Stripe, not a fake request
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except stripe.error.SignatureVerificationError:
        raise Exception("Invalid webhook signature")

    # Only care about successful payments
    if event["type"] != "checkout.session.completed":
        return

    session = event["data"]["object"]
    stripe_session_id = session["id"]

    # Find our payment record
    payment = (
        db.query(Payment).filter(Payment.stripe_session_id == stripe_session_id).first()
    )

    if not payment:
        raise Exception("Payment record not found")

    if payment.status == "completed":
        return  # already processed, ignore duplicate webhook

    # Add credits to user balance
    user = db.query(User).filter(User.id == payment.user_id).first()
    credits = int(session["metadata"]["credits"])
    user.balance += credits

    # Log transaction (sender_id = receiver_id = user, description explains it)
    transaction = Transaction(
        sender_id=user.id,
        receiver_id=user.id,
        amount=credits,
        description=f"Top-up via Stripe — {credits} credits purchased",
        service_request_id=None,
    )
    db.add(transaction)

    payment.status = "completed"
    db.commit()


def get_my_payments(db: Session, user_id: int):
    return (
        db.query(Payment)
        .filter(Payment.user_id == user_id)
        .order_by(Payment.created_at.desc())
        .all()
    )
