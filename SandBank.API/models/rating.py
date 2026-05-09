from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True)
    service_request_id = Column(
        Integer, ForeignKey("service_requests.id"), nullable=False, unique=True
    )
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reviewee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stars = Column(Integer, nullable=False)
    review = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # stars must be 1-5
    __table_args__ = (CheckConstraint("stars >= 1 AND stars <= 5", name="valid_stars"),)

    service_request = relationship("ServiceRequest", back_populates="rating")
    reviewer = relationship(
        "User", foreign_keys=[reviewer_id], back_populates="given_ratings"
    )
    reviewee = relationship(
        "User", foreign_keys=[reviewee_id], back_populates="received_ratings"
    )
