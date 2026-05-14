# SandBank

> Your time is the most valuable currency.

Full-stack Time Bank web application where users exchange services using time credits. Built with FastAPI on the backend and React on the frontend, with JWT-based authentication.

## Tech Stack

**Backend**

- FastAPI — REST API
- SQLAlchemy — ORM
- Alembic — database migrations
- SQLite — database
- python-jose — JWT token-based authentication
- bcrypt — password hashing

**Frontend**

- React + TypeScript
- Vite — build tool
- Axios — HTTP client
- TanStack Query — data fetching and caching
- React Router — client-side routing

## Project Structure

```
SandBank/
├── SandBank.API/               # FastAPI backend
│   ├── routers/                # API endpoints
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── activities.py
│   │   ├── requests.py
│   │   └── transactions.py
│   ├── services/               # Business logic
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── activity_service.py
│   │   ├── request_service.py
│   │   ├── transaction_service.py
│   │   ├── token_service.py
│   │   └── dependencies.py
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   ├── activity.py
│   │   ├── user_activity.py
│   │   ├── service_request.py
│   │   └── transaction.py
│   ├── schemas/                # Pydantic schemas (DTOs)
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── activity.py
│   │   ├── service_request.py
│   │   └── transaction.py
│   ├── database.py             # DB session and engine
│   ├── config.py               # Settings from .env
│   ├── main.py                 # App entry point
│   ├── requirements.txt
│   └── .env                    # Secret keys (not committed)
│
├── sandbank-client/            # React frontend
│   └── src/
│       ├── api/                # Axios instance + API calls
│       ├── context/            # Auth context
│       ├── pages/              # Page components
│       ├── App.tsx             # Routes
│       └── main.tsx            # Entry point
│
└── README.md
```

## Getting Started

### Requirements

- [Python 3.12+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com)

### Clone the repository

```bash
git clone <your-repository-url>
cd SandBank
```

### Backend setup

```bash
cd SandBank.API
```

Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in `SandBank.API/`:

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./sandbank.db
```

> Generate a secure key with: `python3 -c "import secrets; print(secrets.token_hex(32))"`

Run the API:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive docs at `http://localhost:8000/docs`.

### Frontend setup

Open a new terminal:

```bash
cd sandbank-client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

| Method | Endpoint                      | Auth  | Description                                 |
| ------ | ----------------------------- | ----- | ------------------------------------------- |
| POST   | `/api/auth/register`          | No    | Register a new user                         |
| POST   | `/api/auth/login`             | No    | Login and get JWT token                     |
| GET    | `/api/users/me`               | Yes   | Get my profile                              |
| PUT    | `/api/users/me`               | Yes   | Update my profile                           |
| PUT    | `/api/users/me/password`      | Yes   | Change password                             |
| GET    | `/api/users/me/balance`       | Yes   | Get my credit balance                       |
| GET    | `/api/users/`                 | Admin | List all users                              |
| DELETE | `/api/users/{id}`             | Admin | Delete a user                               |
| GET    | `/api/activities/`            | No    | List activities (supports filtering)        |
| POST   | `/api/activities/`            | Yes   | Create an activity                          |
| PUT    | `/api/activities/{id}`        | Yes   | Update activity (owner only)                |
| DELETE | `/api/activities/{id}`        | Yes   | Delete activity (owner or admin)            |
| POST   | `/api/requests/`              | Yes   | Request a service                           |
| GET    | `/api/requests/me`            | Yes   | My outgoing requests                        |
| GET    | `/api/requests/incoming`      | Yes   | Incoming requests on my activities          |
| PUT    | `/api/requests/{id}/accept`   | Yes   | Accept a request (triggers credit transfer) |
| PUT    | `/api/requests/{id}/reject`   | Yes   | Reject a request                            |
| PUT    | `/api/requests/{id}/cancel`   | Yes   | Cancel a request                            |
| PUT    | `/api/requests/{id}/complete` | Yes   | Mark a request as complete                  |
| GET    | `/api/transactions/me`        | Yes   | My transaction history                      |

## How Time Credits Work

- Every new user starts with **20 credits**.
- 1 time token does not traslate to 1 hour of service, value your work as you consider.
- When a service request is **accepted**, credits transfer instantly from requester to provider.
- Credits are logged as transactions for full history tracking.

## Notes

- `venv/` and `.env` are not committed — recreate them on each machine using the steps above.
- The SQLite database file `sandbank.db` is created automatically on first run.
