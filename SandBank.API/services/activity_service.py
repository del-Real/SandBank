from sqlalchemy.orm import Session
from datetime import datetime
from models.activity import Activity
from schemas.activity import CreateActivitySchema, UpdateActivitySchema

def get_all_activities(db: Session, title: str = None, max_duration: int = None):
    query = db.query(Activity)
    if title:
        query = query.filter(Activity.title.ilike(f"%{title}%"))
    if max_duration:
        query = query.filter(Activity.duration <= max_duration)
    return query.all()

def get_activity_by_id(db: Session, activity_id: int):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise Exception("Activity not found")
    return activity

def create_activity(db: Session, data: CreateActivitySchema, owner_id: int):
    activity = Activity(
        title=data.title,
        description=data.description,
        duration=data.duration,
        start_date=data.start_date,
        owner_id=owner_id
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

def update_activity(db: Session, activity_id: int, data: UpdateActivitySchema, current_user_id: int):
    activity = get_activity_by_id(db, activity_id)
    if activity.owner_id != current_user_id:
        raise PermissionError("Not your activity")
    if data.title:
        activity.title = data.title
    if data.description:
        activity.description = data.description
    if data.duration:
        activity.duration = data.duration
    if data.start_date:
        activity.start_date = data.start_date
    activity.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(activity)
    return activity

def delete_activity(db: Session, activity_id: int, current_user_id: int, current_user_role: str):
    activity = get_activity_by_id(db, activity_id)
    if activity.owner_id != current_user_id and current_user_role != "Admin":
        raise PermissionError("Not your activity")
    db.delete(activity)
    db.commit()