# Full-Stack RBAC Task

A simple full-stack application demonstrating authentication,
JWT-based authorization, role-based access control, protected routes,
user management, and dashboard statistics.

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

## Features

- Login using username or email
- JWT authentication using HTTP-only cookies
- Three roles: Admin, Manager and User
- Protected backend APIs
- Protected frontend routes
- Admin user management
- Manager reports
- Dashboard statistics and charts
- Logout
- Token expiry handling

## Role Access

| Role | Dashboard | User Management | Reports |
|------|-----------|-----------------|---------|
| Admin | Yes | Yes | No |
| Manager | Yes | No | Yes |
| User | Yes | No | No |

## Demo Credentials

### Admin
Username: admin
Password: Admin123!

### Manager
Username: manager
Password: Manager123!

### User
Username: user
Password: User123!

## Environment Variables

### Backend

Create `server/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/rbac_app
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=1h
CLIENT_URL=http://localhost:5173