#!/bin/bash

# ==========================================
# Docker Cleanup Script - Pre-Deployment
# Purpose: Remove old containers, images, and volumes before fresh deployment
# ==========================================

set -e

echo "=========================================="
echo "DOCKER CLEANUP - PRE-DEPLOYMENT"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ ERROR: Docker is not running!"
    echo "Please start Docker Desktop first:"
    echo "  open -a Docker"
    echo ""
    echo "Then re-run this script."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# 1. Stop all running containers
echo "📦 Step 1: Stopping all running containers..."
docker stop $(docker ps -q) 2>/dev/null || echo "No running containers to stop"
echo "✅ All containers stopped"
echo ""

# 2. Remove all containers (running and stopped)
echo "🗑️  Step 2: Removing all containers..."
docker rm -f $(docker ps -aq) 2>/dev/null || echo "No containers to remove"
echo "✅ All containers removed"
echo ""

# 3. Remove all FingerMobile-related images
echo "🖼️  Step 3: Removing FingerMobile images..."
docker images | grep fingermobile | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || echo "No FingerMobile images to remove"
echo "✅ FingerMobile images removed"
echo ""

# 4. Remove dangling images (untagged)
echo "🧹 Step 4: Removing dangling images..."
docker image prune -f
echo "✅ Dangling images removed"
echo ""

# 5. Remove unused volumes (WARNING: This deletes data!)
echo "⚠️  WARNING: This will delete all Docker volumes (including database data!)"
read -p "Are you sure you want to delete all volumes? (yes/no): " confirm
if [ "$confirm" = "yes" ]; then
    echo "💾 Step 5: Removing all unused volumes..."
    docker volume prune -f
    echo "✅ All volumes removed"
else
    echo "⏭️  Skipping volume removal (data preserved)"
fi
echo ""

# 6. Remove unused networks
echo "🌐 Step 6: Removing unused networks..."
docker network prune -f
echo "✅ Unused networks removed"
echo ""

# 7. Final system cleanup
echo "🔧 Step 7: Running system prune..."
docker system prune -f
echo "✅ System cleanup complete"
echo ""

# Summary
echo "=========================================="
echo "CLEANUP SUMMARY"
echo "=========================================="
echo ""
echo "Remaining containers:"
docker ps -a | wc -l | xargs echo "  Containers:"
echo ""
echo "Remaining images:"
docker images | wc -l | xargs echo "  Images:"
echo ""
echo "Disk space freed:"
docker system df
echo ""
echo "✅ Docker environment is clean and ready for fresh deployment!"
echo ""
echo "Next step: Run ./deploy-staging.sh"
