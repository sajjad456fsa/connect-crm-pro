# Railway Deployment for Connect CRM Pro

## 1. Create Railway Account
Go to [railway.app](https://railway.app) and sign up (free tier available).

## 2. Create GitHub Repository
1. Go to [github.com](https://github.com) and create a new repository
2. Name it `connect-crm-pro` (or your preferred name)
3. Make it public or private (your choice)
4. **Don't initialize with README** (we already have one)

## 3. Push Code to GitHub
From your terminal (replace YOUR_USERNAME with your GitHub username):

```bash
cd /Users/sajjad/Desktop/CRM
git remote add origin https://github.com/YOUR_USERNAME/connect-crm-pro.git
git branch -M main
git push -u origin main
```

## 4. Connect GitHub to Railway
- In Railway dashboard, click "New Project"
- Choose "Deploy from GitHub repo"
- Connect your GitHub account
- Select the `connect-crm-pro` repository
- Click "Deploy"

## 5. Configure Environment Variables
In Railway dashboard, go to your project settings and add these environment variables:

### Backend Variables (in Railway Variables tab)
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://connect-crm-pro.up.railway.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend Variables (also in Railway Variables tab)
```
NEXT_PUBLIC_API_URL=https://connect-crm-pro.up.railway.app/api
NEXT_PUBLIC_APP_NAME=Connect CRM Pro
```

## 6. Deploy & Database Setup
Railway will automatically:
- Build and deploy using your docker-compose.yml
- Create a PostgreSQL database
- Run database migrations

After deployment, run the seed script to create the admin user:
```bash
railway run npx prisma migrate deploy
railway run npm run seed
```

## 7. Access Your Live CRM
- **Frontend**: `https://connect-crm-pro.up.railway.app`
- **Backend API**: `https://connect-crm-pro.up.railway.app/api`

## 8. Test Credentials
Login with the admin account:
- **Email**: `admin@connectcrm.com`
- **Password**: `Sajjad786`

## Free Tier Limits
- 512MB RAM
- 1GB disk
- Suitable for testing and small teams