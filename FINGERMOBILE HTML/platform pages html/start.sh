#!/bin/bash
# FingerMobile Platform - Quick Start Script
# This script installs dependencies and starts the server

set -e

echo "========================================="
echo "FingerMobile Platform - Quick Start"
echo "========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js not found. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm not found."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Step 1: Install dependencies
echo ""
echo "Step 1: Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Step 2: Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "Step 2: Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your database credentials before starting"
else
    echo "✅ .env file exists"
fi

# Step 3: Start server
echo ""
echo "Step 3: Starting server..."
echo "========================================="
npm start
