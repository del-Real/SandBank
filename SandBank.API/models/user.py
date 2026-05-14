from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="User")
    balance = Column(Integer, nullable=False, default=20)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_activities = relationship("UserActivity", back_populates="user")
    activities = relationship("Activity", back_populates="owner")
    sent_transactions = relationship(
        "Transaction", foreign_keys="Transaction.sender_id", back_populates="sender"
    )
    received_transactions = relationship(
        "Transaction", foreign_keys="Transaction.receiver_id", back_populates="receiver"
    )
    service_requests = relationship(
        "ServiceRequest",
        foreign_keys="ServiceRequest.requester_id",
        back_populates="requester",
    )
    payments = relationship("Payment", back_populates="user")
    given_ratings = relationship(
        "Rating", foreign_keys="Rating.reviewer_id", back_populates="reviewer"
    )
    received_ratings = relationship(
        "Rating", foreign_keys="Rating.reviewee_id", back_populates="reviewee"
    )
    is_active = Column(Boolean, nullable=False, default=True)
