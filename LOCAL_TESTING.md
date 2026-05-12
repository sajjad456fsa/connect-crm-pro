# Local Testing Guide

Use this guide to run the CRM locally for development and QA.

## Option 1: Docker Compose (recommended)

This is the fastest way to run the full stack locally.

1. In the project root:
   ```bash
   docker compose up --build
   ```

   Or use the helper script if Docker is installed:
   ```bash
   ./run-local.sh
   ```

   Or run directly from npm:
   ```bash
   npm run docker:start
   ```

2. Open the application:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:4000`
   - Health: `http://localhost:4000/health`

3. Default local database settings are already configured in `docker-compose.yml`.

4. The first backend startup will auto-create the admin user if it does not exist:
   - Email: `admin@connectcrm.com`
   - Password: `Sajjad786`

## Option 2: Local Node.js development

If you want to run backend and frontend without Docker, install Node.js 18+.

### Backend

1. Copy environment variables:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend:
   ```bash
   npm start
   ```

### Frontend

1. Copy environment variables:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend in development mode:
   ```bash
   npm run dev
   ```

4. Open the app:
   - `http://localhost:3000`

### Notes

- Ensure `frontend/.env` has `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
- If you do not have a local PostgreSQL instance, use Docker Compose for the database.
- If you need Node.js installed, use a version manager such as `nvm`.

## Troubleshooting

- If the frontend cannot reach the backend, verify the backend is running on port `4000`.
- If the backend cannot connect to the database, confirm the PostgreSQL container is healthy.
- Use the health endpoint to verify the backend:
  - `http://localhost:4000/health`

## Quick commands

```bash
# start local stack
docker compose up --build

# stop local stack
docker compose down
```
