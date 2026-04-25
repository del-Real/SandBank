from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False, default="pending")
    # pending | accepted | rejected | cancelled | completed
    created_at = Column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity", back_populates="service_requests")
    requester = relationship("User", foreign_keys=[requester_id], back_populates="service_requests")
    transaction = relationship("Transaction", back_populates="service_request", uselist=False)