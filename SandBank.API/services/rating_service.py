from sqlalchemy.orm import Session
from models.rating import Rating
from models.service_request import ServiceRequest
from schemas.rating import CreateRatingSchema


def create_rating(db: Session, data: CreateRatingSchema, reviewer_id: int) -> Rating:
    request = (
        db.query(ServiceRequest)
        .filter(ServiceRequest.id == data.service_request_id)
        .first()
    )

    if not request:
        raise Exception("Service request not found")

    # only requester can rate
    if request.requester_id != reviewer_id:
        raise PermissionError("Only the requester can rate a service")

    # only completed services can be rated
    if request.status != "completed":
        raise Exception("You can only rate completed services")

    # one rating per service request
    existing = (
        db.query(Rating)
        .filter(Rating.service_request_id == data.service_request_id)
        .first()
    )
    if existing:
        raise Exception("You have already rated this service")

    # reviewee is the activity owner (the provider)
    reviewee_id = request.activity.owner_id

    rating = Rating(
        service_request_id=data.service_request_id,
        reviewer_id=reviewer_id,
        reviewee_id=reviewee_id,
        stars=data.stars,
        review=data.review,
    )
    db.add(rating)
    db.commit()
    db.refresh(rating)
    return rating


def get_ratings_for_user(db: Session, user_id: int):
    # ratings received by a user (as a provider)
    return (
        db.query(Rating)
        .filter(Rating.reviewee_id == user_id)
        .order_by(Rating.created_at.desc())
        .all()
    )


def get_ratings_for_activity(db: Session, activity_id: int):
    # ratings on all requests for a specific activity
    return (
        db.query(Rating)
        .join(ServiceRequest)
        .filter(ServiceRequest.activity_id == activity_id)
        .order_by(Rating.created_at.desc())
        .all()
    )


def get_my_given_ratings(db: Session, reviewer_id: int):
    return (
        db.query(Rating)
        .filter(Rating.reviewer_id == reviewer_id)
        .order_by(Rating.created_at.desc())
        .all()
    )
