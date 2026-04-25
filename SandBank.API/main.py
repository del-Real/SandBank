from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, users, activities, requests, transactions

import models.user
import models.activity
import models.user_activity
import models.service_request
import models.transaction

from routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(activities.router)
app.include_router(requests.router)
app.include_router(transactions.router)

@app.get("/")
def root():
    return {"message": "SandBank API"}