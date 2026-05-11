# Quick Render.com Deployment for Connect CRM Demo

## 🚀 Fastest Way to Get a Live Demo

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub/Google (free tier available)

### Step 2: Connect GitHub Repo
- If you haven't pushed to GitHub yet, do this first:
```bash
cd /Users/sajjad/Desktop/CRM
git remote add origin https://github.com/YOUR_USERNAME/connect-crm-pro.git
git push -u origin main
```

### Step 3: Create PostgreSQL Database
1. In Render dashboard: "New" → "PostgreSQL"
2. Name: `crm-db`
3. Region: Any (e.g., Oregon)
4. Plan: Free
5. Create database

### Step 4: Deploy Backend
1. "New" → "Web Service"
2. Connect GitHub repo: `connect-crm-pro`
3. Name: `crm-backend`
4. Runtime: `Docker`
5. Build Command: Leave empty (uses Dockerfile)
6. Start Command: `npm start`
7. Add environment variables:
   ```
   DATABASE_URL=[Your PostgreSQL external URL from Render]
   JWT_SECRET=your-super-secret-jwt-key-demo
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-demo
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=[Your frontend URL - we'll set this next]
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```
8. Deploy

### Step 5: Deploy Frontend
1. "New" → "Static Site"
2. Connect same GitHub repo
3. Name: `crm-frontend`
4. Build Command: `npm run build`
5. Publish Directory: `out`
6. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=[Your backend URL]/api
   NEXT_PUBLIC_APP_NAME=Connect CRM Pro
   ```
7. Deploy

### Step 6: Update Backend URL
- Go back to backend service
- Update `FRONTEND_URL` with your frontend URL
- Redeploy backend

### Step 7: Seed Database
- In backend service, go to "Shell" tab
- Run: `npx prisma migrate deploy && npm run seed`

### Your Demo URLs:
- **Frontend**: `https://crm-frontend.onrender.com`
- **Backend API**: `https://crm-backend.onrender.com/api`

### Test Credentials:
- Email: `admin@connectcrm.com`
- Password: `Sajjad786`

## ⏱️ Timeline: 10-15 minutes</content>
<parameter name="filePath">/Users/sajjad/Desktop/CRM/QUICK_RENDER_DEPLOY.md