#!/usr/bin/env bash
# Setup script for Pest & Disease Reporting System
# This script helps you get started quickly

echo "🚀 Pest & Disease Reporting System - Setup Script"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "Setting up Backend..."
cd backend 2>/dev/null || { echo "❌ Backend directory not found"; exit 1; }
echo "📦 Installing backend dependencies..."
npm install > /dev/null 2>&1

if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your MongoDB URI"
fi

cd ..
echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "Setting up Frontend..."
cd frontend 2>/dev/null || { echo "❌ Frontend directory not found"; exit 1; }
echo "📦 Installing frontend dependencies..."
npm install > /dev/null 2>&1

cd ..
echo "✅ Frontend setup complete!"
echo ""

# Summary
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MongoDB URI"
echo "2. Open two terminals"
echo ""
echo "Terminal 1 - Start Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Start Frontend:"
echo "  cd frontend && npm start"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "📖 For detailed setup, read QUICKSTART.md"
echo ""
