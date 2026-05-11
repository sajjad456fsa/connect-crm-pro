#!/bin/bash

# Connect CRM Pro - Production Deployment Script
# Run this on your VPS after cloning the repository

echo "🚀 Starting Connect CRM Pro deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
sudo apt install -y docker.io docker-compose-v2
sudo systemctl start docker
sudo systemctl enable docker

# Allow current user to run Docker
sudo usermod -aG docker $USER

# Clone repository (if not already done)
# git clone <your-repo-url> crm-app
# cd crm-app

# Create production environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

echo "⚠️  Please edit the .env files with your production values:"
echo "   - backend/.env: DATABASE_URL, JWT secrets, SMTP settings"
echo "   - frontend/.env: NEXT_PUBLIC_API_URL"

# Build and start services
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Wait for services to start
sleep 30

# Run database migrations
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed admin user
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npm run seed

# Check if services are running
docker compose ps

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://your-server-ip:3000"
echo "🔧 Backend: http://your-server-ip:4000"
echo ""
echo "📧 Don't forget to:"
echo "   - Set up a reverse proxy (nginx) for SSL"
echo "   - Configure firewall (ufw)"
echo "   - Set up monitoring and backups"