from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    description = Column(String, nullable=False)
    service_request_id = Column(Integer, ForeignKey("service_requests.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_transactions")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_transactions")
    service_request = relationship("ServiceRequest", back_populates="transaction")