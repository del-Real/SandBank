from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    status = Column(String, nullable=False)
    role = Column(String, nullable=False)
    added_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="user_activities")