# Local Testing with ngrok (Free Test Domain)

## 1. Install ngrok
Download from [ngrok.com](https://ngrok.com/download) and follow installation instructions.

## 2. Sign up for ngrok account
- Create account at ngrok.com
- Get your auth token from dashboard

## 3. Authenticate ngrok
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

## 4. Start the CRM app locally
```bash
cd /Users/sajjad/Desktop/CRM
docker compose up --build
```

## 4.5 Seed the database (in another terminal)
```bash
docker compose exec backend npm run seed
```

## 5. Create ngrok tunnel
Open a new terminal and run:
```bash
ngrok http 3000
```

This will give you a URL like: `https://abc123.ngrok.io`

## 6. Access your test domain
- Frontend: `https://abc123.ngrok.io`
- The tunnel will forward requests to your local frontend on port 3000
- Backend API calls will work through the frontend

## 7. For full API access
If you need direct API access, create another tunnel:
```bash
ngrok http 4000
```

Then set `NEXT_PUBLIC_API_URL=https://def456.ngrok.io/api` in frontend/.env

## Notes
- ngrok URLs are temporary (last 8 hours on free plan)
- Perfect for demos and testing
- No need to deploy to a server