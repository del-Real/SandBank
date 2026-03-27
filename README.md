# SandBank

> Your time is the most valuable currency.

SandBank is a full-stack web application for managing and tracking activities. Built with ASP.NET on the backend and React on the frontend, with JWT-based authentication.

---

## Tech Stack

**Backend**

- ASP.NET Core — REST API
- Entity Framework Core — ORM
- SQLite — database
- JWT — token-based authentication
- BCrypt — password hashing

**Frontend**

- React + TypeScript
- Vite — build tool
- Axios — HTTP client
- TanStack Query — data fetching and caching
- React Router — client-side routing

---

## Project Structure

```
SandBank/
├── SandBank.API/               # ASP.NET backend
│   ├── Controllers/            # API endpoints
│   ├── Services/               # Business logic
│   ├── Models/                 # Database entities
│   ├── DTOs/                   # Data transfer objects
│   ├── Data/                   # DbContext
│   ├── Migrations/             # EF Core migrations
│   ├── Program.cs              # App configuration
│   └── appsettings.json        # App settings
│
├── sandbank-client/            # React frontend
│   └── src/
│       ├── api/                # Axios instance
│       ├── context/            # Auth context
│       ├── hooks/              # TanStack Query hooks
│       ├── pages/              # Page components
│       ├── components/         # Shared components
│       ├── App.tsx             # Routes
│       └── main.tsx            # Entry point
│
├── API.md                      # API documentation
└── USER_GUIDE.md               # User guide
```

---

## Getting Started

### Requirements

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com)

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd SandBank
```

### 2. Backend setup

```bash
cd SandBank.API
```

Set your JWT secret key:

```bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:SecretKey" "your-generated-secret-key"
```

> Generate a secure key with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

Apply database migrations:

```bash
dotnet ef database update
```

Run the API:

```bash
dotnet run
```

API runs at **http://localhost:5156**

### 3. Frontend setup

Open a new terminal:

```bash
cd sandbank-client
npm install
npm run dev
```

App runs at **http://localhost:5173**
