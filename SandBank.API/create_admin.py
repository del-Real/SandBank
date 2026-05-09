from database import SessionLocal, engine
from models.user import User
from models import (
    user,
    activity,
    user_activity,
    service_request,
    transaction,
    payment,
    rating,
)
import bcrypt
from database import Base

Base.metadata.create_all(bind=engine)


def create_admin():
    db = SessionLocal()

    email = "admin@sandbank.com"
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"Admin already exists: {existing.email} (role: {existing.role})")
        db.close()
        return

    admin = User(
        username="admin",
        email=email,
        password_hash=bcrypt.hashpw(
            "admin1234".encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8"),
        role="Admin",
        balance=999,
        is_active=True,
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)
    print(f"Admin created — email: {email} | password: admin1234")
    db.close()


if __name__ == "__main__":
    create_admin()
