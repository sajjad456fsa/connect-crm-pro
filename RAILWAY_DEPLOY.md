# Railway Deployment for Connect CRM Pro

## 1. Create Railway Account
Go to [railway.app](https://railway.app) and sign up (free tier available).

## 2. Connect GitHub Repository
- Create a new project on Railway
- Connect your GitHub repo containing the CRM code
- Railway will auto-detect the docker-compose.yml

## 3. Configure Environment Variables
In Railway dashboard, add these environment variables:

### Backend Variables
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://your-app-name.up.railway.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend Variables
```
NEXT_PUBLIC_API_URL=https://your-app-name.up.railway.app/api
NEXT_PUBLIC_APP_NAME=Connect CRM Pro
```

## 4. Deploy
Railway will automatically build and deploy using your docker-compose.yml.

## 5. Access Your App
- Frontend: `https://your-app-name.up.railway.app`
- Backend API: `https://your-app-name.up.railway.app/api`

## 6. Database Setup
Railway provides PostgreSQL automatically. Run migrations and seed:
```bash
railway run npx prisma migrate deploy
railway run npm run seed
```

## Free Tier Limits
- 512MB RAM
- 1GB disk
- Suitable for testing and small teams