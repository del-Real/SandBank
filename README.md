# SandBank

## Installation Guide

This guide brings up the current local development environment for the repository as implemented today:

- Backend: FastAPI on `http://localhost:8000`
- Frontend: Vite on `http://localhost:5173`
- Default database: SQLite file created locally on first run

## Prerequisites

| Requirement | Recommended version | Why it is needed                    |
| ----------- | ------------------- | ----------------------------------- |
| Python      | 3.10 or newer       | FastAPI backend runtime             |
| Node.js     | 18 or newer         | Frontend tooling and dev server     |
| npm         | 9 or newer          | Frontend package manager            |
| Git         | any recent version  | Cloning and updating the repository |

Optional:

- Stripe account and Stripe CLI if you want to test credit purchases end to end

## Quick Start

If you only need a local dev environment, the shortest path is:

```bash
git clone <your-repository-url>
cd SandBank-dev
cd SandBank.API
python -m venv venv
```

Activate the virtual environment, install backend packages, create `.env`, run the API, then in a second terminal install frontend packages and run Vite.

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd SandBank-dev
```

## 2. Backend Setup

### 2.1 Create the virtual environment

```bash
cd SandBank.API
python -m venv venv
```

### 2.2 Activate it

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Windows Command Prompt:

```cmd
venv\Scripts\activate.bat
```

macOS or Linux:

```bash
source venv/bin/activate
```

### 2.3 Install backend dependencies

```bash
pip install -r requirements.txt
```

Installed packages include FastAPI, Uvicorn, SQLAlchemy, JWT tooling, and Stripe support.

### 2.4 Create `.env`

Create `SandBank.API/.env` with the following values:

```env
SECRET_KEY=replace-with-a-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./sandbank.db
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

| Variable                      | Required | Current role in app                           |
| ----------------------------- | -------- | --------------------------------------------- |
| `SECRET_KEY`                  | Yes      | Signs JWT access tokens                       |
| `ALGORITHM`                   | No       | Defaults to `HS256`                           |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No       | Defaults to `30`                              |
| `DATABASE_URL`                | No       | Defaults to local SQLite                      |
| `STRIPE_SECRET_KEY`           | No       | Required only for `/api/payments/checkout`    |
| `STRIPE_WEBHOOK_SECRET`       | No       | Required only for Stripe webhook verification |

Generate a strong secret key with:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 2.5 Database behavior

No manual migration step is required for the default local setup. The backend currently creates tables on startup using SQLAlchemy metadata.

With the default config, the SQLite database file is created as:

```text
SandBank.API/sandbank.db
```

New user accounts created through the API receive a default balance of **20 credits**.

### 2.6 Optional admin bootstrap

To seed the default admin account:

```bash
python create_admin.py
```

This script creates the following account if it does not already exist:

| Field            | Value                |
| ---------------- | -------------------- |
| Email            | `admin@sandbank.com` |
| Password         | `admin1234`          |
| Role             | `Admin`              |
| Starting balance | `999`                |

This is a development convenience only. Change or remove it outside local testing.

### 2.7 Run the backend

```bash
uvicorn main:app --reload --port 8000
```

Useful URLs:

| URL                           | Purpose                    |
| ----------------------------- | -------------------------- |
| `http://localhost:8000/`      | Root health-style response |
| `http://localhost:8000/docs`  | Swagger UI                 |
| `http://localhost:8000/redoc` | ReDoc                      |

## 3. Frontend Setup

Open a second terminal from the repository root.

### 3.1 Install frontend dependencies

```bash
cd sandbank-client
npm install
```

### 3.2 Backend URL used by the frontend

The current client is hard-coded to:

```text
http://localhost:8000/api
```

If you change the backend host or port, update `sandbank-client/src/api/axiosInstance.ts` accordingly.

### 3.3 Run the frontend

```bash
npm run dev
```

The default local URL is:

```text
http://localhost:5173
```

### 3.4 Build the frontend

```bash
npm run build
```

Artifacts are written to `sandbank-client/dist`.

## 4. Start Both Services Together

Terminal 1, backend:

```bash
cd SandBank.API
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

Terminal 2, frontend:

```bash
cd sandbank-client
npm run dev
```

At that point you should be able to:

1. Open `http://localhost:5173`
2. Register a user or seed the admin user
3. Call backend docs at `http://localhost:8000/docs`

## 5. Stripe Integration

Stripe support is optional for local setup, but required if you want the `Buy Time Credits` flow to work.

### What the current code expects

- `/api/payments/checkout` creates a Stripe Checkout Session
- Success redirect: `http://localhost:5173/credits?status=success`
- Cancel redirect: `http://localhost:5173/credits?status=cancelled`
- Webhook endpoint: `http://localhost:8000/api/payments/webhook`

### Local Stripe steps

1. Add `STRIPE_SECRET_KEY` to `.env`
2. Install the Stripe CLI
3. Run:

```bash
stripe listen --forward-to localhost:8000/api/payments/webhook
```

4. Copy the webhook signing secret from the CLI output into `STRIPE_WEBHOOK_SECRET`

## 6. Useful Commands

### Backend

| Command                                 | Purpose                       |
| --------------------------------------- | ----------------------------- |
| `uvicorn main:app --reload --port 8000` | Start API in development mode |
| `python create_admin.py`                | Seed the default admin user   |

### Frontend

| Command           | Purpose                            |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the Vite dev server          |
| `npm run build`   | Produce a production build         |
| `npm run preview` | Preview the built frontend locally |
| `npm run lint`    | Run ESLint                         |

## 7. Verification Checklist

After setup, verify the environment with this checklist:

1. Backend server starts without import errors
2. `http://localhost:8000/docs` loads
3. Frontend dev server starts without dependency errors
4. `http://localhost:5173` loads the home page
5. Registering a new user returns you to the home page with an authenticated session

## 8. Troubleshooting

| Problem                                | Likely cause                                             | Action                                                              |
| -------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- |
| `ModuleNotFoundError` on backend start | Virtual environment not active or packages not installed | Activate the venv and rerun `pip install -r requirements.txt`       |
| Browser request fails to reach API     | Backend not running or wrong base URL                    | Check `uvicorn` output and `axiosInstance.ts`                       |
| SQLite operational errors              | Corrupt or stale local DB file                           | Stop the API, remove `sandbank.db`, restart                         |
| Stripe webhook verification fails      | Wrong webhook secret                                     | Replace `STRIPE_WEBHOOK_SECRET` with the value from `stripe listen` |
| Port `8000` or `5173` is busy          | Existing process already bound                           | Stop the old process or run the service on a different port         |

## 9. Repository Layout Reference

```text
SandBank-dev/
├── SandBank.API/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── create_admin.py
│   ├── requirements.txt
│   └── sandbank.db          # created locally on first run
├── sandbank-client/
│   ├── package.json
│   ├── src/
│   └── dist/                # created by npm run build
└── docs/
```
