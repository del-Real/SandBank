from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.rating import CreateRatingSchema, RatingSchema
from services import rating_service
from services.dependencies import get_current_user
from models.user import User

router = APIRouter(prefix="/api/ratings", tags=["ratings"])


@router.post("/", response_model=RatingSchema, status_code=201)
def create_rating(
    data: CreateRatingSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return rating_service.create_rating(db, data, current_user.id)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/user/{user_id}", response_model=list[RatingSchema])
def get_user_ratings(user_id: int, db: Session = Depends(get_db)):
    return rating_service.get_ratings_for_user(db, user_id)


@router.get("/activity/{activity_id}", response_model=list[RatingSchema])
def get_activity_ratings(activity_id: int, db: Session = Depends(get_db)):
    return rating_service.get_ratings_for_activity(db, activity_id)


@router.get("/me", response_model=list[RatingSchema])
def get_my_ratings(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return rating_service.get_my_given_ratings(db, current_user.id)
