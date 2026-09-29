# Full-Stack RBAC Task

A simple full-stack application implementing authentication, JWT, role-based access control (RBAC), protected routes, user management, reports, and dashboard charts.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Recharts

### Backend
- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- Zod

### Database / Container
- PostgreSQL 16
- Docker
- Docker Compose

## Features

- Login using username or email
- JWT authentication using HTTP-only cookies
- Three roles: Admin, Manager, User
- Protected backend APIs
- Protected frontend routes
- Admin user management
- Manager reports
- Dashboard statistics and charts
- Logout and token expiry handling

## Role Access

| Role | Dashboard | User Management | Reports |
|---|---|---|---|
| Admin | Yes | Yes | No |
| Manager | Yes | No | Yes |
| User | Yes | No | No |

## Run with Docker

Make sure Docker Desktop is running.

From the project root:

```bash
docker compose up --build
```

This starts:

- PostgreSQL on port `5433`
- Backend API on port `5000`
- Frontend on port `5173`

Open:

```text
http://localhost:5173
```

To stop the containers:

```bash
docker compose down
```

To reset the database:

```bash
docker compose down -v
```

## Manual Setup and Run Instructions

### 1. Clone the repository

```bash
git clone https://github.com/leejustin0107-ux/RBAC_Task.git
cd RBAC_Task
```

### 2. Start PostgreSQL

From the project root:

```bash
docker compose up -d db
```

### 3. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/rbac_app
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
CLIENT_URL=http://localhost:5173
```

Create the database schema:

```powershell
Get-Content sql/schema.sql | docker exec -i rbac-postgres psql -U postgres -d rbac_app
```

Seed the demo users:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 4. Setup the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Demo Credentials

### Admin

```text
Username: admin
Email: admin@example.com
Password: Admin123!
```

### Manager

```text
Username: manager
Email: manager@example.com
Password: Manager123!
```

### User

```text
Username: user
Email: user@example.com
Password: User123!
```

Both username and email can be used to log in.

## Main API Endpoints

### Authentication

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Dashboard

```text
GET /api/dashboard
```

### User Management — Admin Only

```text
GET   /api/users
POST  /api/users
PATCH /api/users/:id
```

### Reports — Manager Only

```text
GET /api/reports
```