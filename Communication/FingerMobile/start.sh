#!/bin/bash

# Startup script for the FingerMobile Communications App

echo "Starting FingerMobile Communications Service..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Set environment variables
export NODE_ENV=production

# Start the service
echo "Starting Communications service on port $COMMUNICATIONS_PORT..."
node dist/index.js 2>&1 | tee -a logs/communications-service.log &

echo "Communications service started successfully!"
echo "Check logs/communications-service.log for details."