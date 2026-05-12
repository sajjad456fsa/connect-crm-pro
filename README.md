# Connect CRM Pro

A fully custom self-hosted CRM web application built with Next.js, React, TypeScript, Tailwind CSS, Prisma, Express, JWT authentication, Socket.io, and PostgreSQL.

## Features

- Authentication with registration, login, refresh tokens, password reset, and email verification
- Role-based access control for Super Admin, Admin, Sales Manager, Sales Agent, and Support Staff
- Lead management with advanced statuses, priorities, and pipeline views
- Customer database with billing details and project history
- Task management with assignments, priorities, and due dates
- Reporting dashboard with lead and revenue summaries
- Settings panel for branding, SMTP, and notification control
- Secure backend with Helmet, CORS, rate limiting, and validation
- Docker-ready deployment with PostgreSQL database

## Project structure

- `frontend/` - Next.js application
- `backend/` - Express API server
- `docker-compose.yml` - Local stack for frontend, backend, and PostgreSQL

## Getting started

### Backend

1. Copy `backend/.env.example` to `backend/.env` and update values.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Run database migrations or introspect if needed.

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env` and update the API URL.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Run locally

There are two easy local options for testing your CRM:

1. **Docker Compose (recommended)**

   ```bash
   docker compose up --build
   ```

   Or run the helper script:

   ```bash
   ./run-local.sh
   ```

   Or use npm:

   ```bash
   npm run local
   ```

   Or start directly with Docker Compose:

   ```bash
   npm run docker:start
   ```

   Then visit:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:4000`
   - Health check: `http://localhost:4000/health`

   This starts:
   - PostgreSQL database
   - Backend API server
   - Frontend web app

2. **Local Node.js development**

   If you have Node.js installed locally, you can run the backend and frontend separately.

   Backend:
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm start
   ```

   Frontend:
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

   Then open:
   - `http://localhost:3000`

   Make sure the backend URL in `frontend/.env` is set to `http://localhost:4000/api`.

For a complete local setup guide, see `LOCAL_TESTING.md`.

## Testing

### Backend tests

From the `backend/` folder:

```bash
npm install
npm test
```

### Frontend tests

From the `frontend/` folder:

```bash
npm install
npm test
```

## Quick Testing Options

### Option 1: Local with ngrok (Free Test Domain)
For immediate testing without deployment:
1. Install [ngrok](https://ngrok.com)
2. Run `docker compose up --build`
3. Run `ngrok http 3000` in another terminal
4. Access via the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. See `NGROK_TESTING.md` for details

### Option 2: Railway Deployment (Free Hosting)
Deploy to Railway for a persistent test domain:
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Railway auto-deploys with Postgres
4. Get a `*.up.railway.app` domain
5. See `RAILWAY_DEPLOY.md` for details

## Deployment

### VPS Deployment (Recommended)

1. **Choose a VPS provider** (DigitalOcean, Linode, Vultr, AWS EC2, etc.)
   - Ubuntu 22.04 LTS, 2GB RAM minimum
   - Enable SSH access

2. **Server setup**
   ```bash
   # Connect to your server
   ssh root@your-server-ip
   
   # Run the deployment script
   wget https://raw.githubusercontent.com/your-repo/deploy.sh
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Configure environment**
   Edit `backend/.env` and `frontend/.env` with production values:
   ```bash
   # Database
   DATABASE_URL="postgresql://postgres:password@db:5432/connectcrm"
   
   # JWT
   JWT_SECRET="your-production-jwt-secret"
   JWT_REFRESH_SECRET="your-production-refresh-secret"
   
   # SMTP (for email)
   SMTP_HOST="smtp.gmail.com"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   
   # Frontend
   NEXT_PUBLIC_API_URL="https://your-domain.com/api"
   ```

4. **Domain and SSL**
   - Point your domain to the server IP
   - Install nginx as reverse proxy:
   ```bash
   sudo apt install nginx
   sudo cp nginx.conf /etc/nginx/sites-available/connect-crm
   sudo ln -s /etc/nginx/sites-available/connect-crm /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```
   - Install SSL with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

5. **Access your CRM**
   - Frontend: `https://your-domain.com`
   - Backend API: `https://your-domain.com/api`

### Alternative Deployments

- **Railway**: Push to GitHub, connect Railway, use their Postgres
- **Render**: Similar to Railway, supports Docker
- **Fly.io**: Free Docker deployments
- **AWS/Azure**: Use ECS/EKS for container orchestration

## Testing Credentials

After running the seed script, use these credentials to test the app:

- **Email**: admin@connectcrm.com
- **Password**: Sajjad786
- **Role**: Super Admin (full access to all features)

## Notes

- The backend uses Prisma schema located at `backend/prisma/schema.prisma`.
- The frontend includes responsive dashboard, leads, customers, tasks, reports, and settings pages.
- JWT authentication is configured for secure API access.
