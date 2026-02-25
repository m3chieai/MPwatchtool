#!/bin/bash

echo "🚀 Master Piece - Quick Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL command-line tools not found."
    echo "   Please ensure PostgreSQL is installed and running."
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "   Please create .env.local with your database credentials."
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

# Push database schema
echo "🗄️  Pushing database schema..."
echo "   Make sure your PostgreSQL database is running!"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Failed to push database schema"
    echo "   Please check your DATABASE_URL in .env.local"
    exit 1
fi

echo "✅ Database schema pushed"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser."
echo ""
echo "📚 Check README.md for more information."
