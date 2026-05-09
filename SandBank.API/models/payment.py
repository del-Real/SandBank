from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stripe_session_id = Column(String, nullable=False, unique=True)
    credits = Column(Integer, nullable=False)  # credits to add on success
    amount_eur = Column(Integer, nullable=False)  # price in euro cents (500 = €5)
    status = Column(String, nullable=False, default="pending")
    # pending | completed | failed
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="payments")
