# Alternative Testing Options

## Option 3: Render.com (Free Tier)
1. Sign up at [render.com](https://render.com)
2. Connect your GitHub repo
3. Create services:
   - PostgreSQL database
   - Backend web service (Docker)
   - Frontend static site
4. Set environment variables
5. Deploy and get `your-app.onrender.com` URL

## Option 4: Fly.io (Free Tier)
1. Sign up at [fly.io](https://fly.io)
2. Install flyctl: `curl -L https://fly.io/install.sh | sh`
3. Run `fly launch` in your project directory
4. Deploy with `fly deploy`
5. Get `your-app.fly.dev` URL

## Option 5: Local Testing with Temporary Domain
If you want a quick test without full deployment:

1. Install ngrok: `npm install -g ngrok`
2. Run your app: `docker compose up --build`
3. Seed data: `docker compose exec backend npm run seed`
4. Create tunnel: `ngrok http 3000`
5. Share the ngrok URL (e.g., `https://abc123.ngrok.io`)

## Test Credentials
- Email: admin@connectcrm.com
- Password: Sajjad786

## API Testing
You can also test the API directly:
- POST `/api/auth/login` with the credentials above
- GET `/api/leads` (after login)
- Use tools like Postman or curl