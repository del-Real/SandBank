from sqlalchemy.orm import Session
from models.service_request import ServiceRequest
from models.activity import Activity
from models.transaction import Transaction
from models.user import User
from schemas.service_request import CreateServiceRequestSchema
from datetime import datetime

def create_request(db: Session, data: CreateServiceRequestSchema, requester_id: int):
    activity = db.query(Activity).filter(Activity.id == data.activity_id).first()
    if not activity:
        raise Exception("Activity not found")
    if activity.owner_id == requester_id:
        raise Exception("You cannot request your own activity")

    requester = db.query(User).filter(User.id == requester_id).first()
    if requester.balance < activity.duration:
        raise Exception(f"Insufficient balance. Need {activity.duration} credits, you have {requester.balance}")

    request = ServiceRequest(
        activity_id=data.activity_id,
        requester_id=requester_id,
        status="pending"
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

def accept_request(db: Session, request_id: int, current_user_id: int):
    request = _get_request(db, request_id)

    # only activity owner can accept
    if request.activity.owner_id != current_user_id:
        raise PermissionError("Not your activity")
    if request.status != "pending":
        raise Exception(f"Cannot accept a request with status '{request.status}'")

    requester = db.query(User).filter(User.id == request.requester_id).first()
    provider = db.query(User).filter(User.id == request.activity.owner_id).first()
    amount = request.activity.duration

    # balance check again at transfer time
    if requester.balance < amount:
        raise Exception("Requester has insufficient balance")

    # transfer credits
    requester.balance -= amount
    provider.balance += amount

    # log transaction
    transaction = Transaction(
        sender_id=requester.id,
        receiver_id=provider.id,
        amount=amount,
        description=f"Payment for '{request.activity.title}'",
        service_request_id=request.id
    )
    db.add(transaction)

    request.status = "accepted"
    db.commit()
    db.refresh(request)
    return request

def reject_request(db: Session, request_id: int, current_user_id: int):
    request = _get_request(db, request_id)
    if request.activity.owner_id != current_user_id:
        raise PermissionError("Not your activity")
    if request.status != "pending":
        raise Exception(f"Cannot reject a request with status '{request.status}'")
    request.status = "rejected"
    db.commit()
    db.refresh(request)
    return request

def cancel_request(db: Session, request_id: int, current_user_id: int):
    request = _get_request(db, request_id)
    if request.requester_id != current_user_id:
        raise PermissionError("Not your request")
    if request.status not in ("pending",):
        raise Exception(f"Cannot cancel a request with status '{request.status}'")
    request.status = "cancelled"
    db.commit()
    db.refresh(request)
    return request

def complete_request(db: Session, request_id: int, current_user_id: int):
    request = _get_request(db, request_id)
    is_requester = request.requester_id == current_user_id
    is_provider = request.activity.owner_id == current_user_id
    if not (is_requester or is_provider):
        raise PermissionError("Not involved in this request")
    if request.status != "accepted":
        raise Exception(f"Cannot complete a request with status '{request.status}'")
    request.status = "completed"
    db.commit()
    db.refresh(request)
    return request

def get_my_requests(db: Session, current_user_id: int):
    return db.query(ServiceRequest).filter(
        ServiceRequest.requester_id == current_user_id
    ).all()

def get_incoming_requests(db: Session, current_user_id: int):
    # requests on activities I own
    return db.query(ServiceRequest).join(Activity).filter(
        Activity.owner_id == current_user_id
    ).all()

# private helper
def _get_request(db: Session, request_id: int):
    request = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not request:
        raise Exception("Request not found")
    return request