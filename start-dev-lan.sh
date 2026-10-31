#!/usr/bin/env bash

# ==============================================================================
# FingerMobile Protocol - Master Development & LAN Startup Script
# ==============================================================================
# Usage:
#   chmod +x start-dev-lan.sh
#   ./start-dev-lan.sh
# ==============================================================================

set -e

WORKSPACE_ROOT="/Users/user/Documents/FingerMobile Protocol Communication"
BACKEND_DIR="$WORKSPACE_ROOT/FingerMobile Protocol/apps/backend"
FRONTEND_DIR="$WORKSPACE_ROOT/FingerMobile Protocol/apps/frontend-main"
WATCHER_SCRIPT="$WORKSPACE_ROOT/auto commit watcher-git-commit-watcher.js"

# Terminal Colors
C_RESET='\033[0m'
C_BOLD='\033[1m'
C_GREEN='\033[32m'
C_CYAN='\033[36m'
C_YELLOW='\033[33m'
C_RED='\033[31m'

echo -e "\n${C_BOLD}${C_CYAN}======================================================================${C_RESET}"
echo -e "${C_BOLD}${C_CYAN}  FingerMobile Protocol - Development & LAN Multi-Device Startup      ${C_RESET}"
echo -e "${C_BOLD}${C_CYAN}======================================================================${C_RESET}\n"

# 1. Determine Local LAN IP
LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
if [ -z "$LAN_IP" ]; then
  LAN_IP="127.0.0.1"
fi
echo -e "${C_BOLD}📡 Detected Host IP:${C_RESET} ${C_GREEN}${LAN_IP}${C_RESET}"

# 2. Check Docker / PostgreSQL / Redis Prerequisites
echo -e "\n${C_BOLD}🔍 [1/5] Verifying PostgreSQL (Port 5433) & Redis (Port 6379)...${C_RESET}"

if nc -z 127.0.0.1 5433 2>/dev/null; then
  echo -e "   ${C_GREEN}✓ PostgreSQL on port 5433 is active and accepting connections.${C_RESET}"
else
  echo -e "   ${C_RED}✗ PostgreSQL on port 5433 is NOT reachable!${C_RESET}"
  echo -e "   ${C_YELLOW}Please ensure Docker Desktop is started and 'fingermobile_postgres' container is up.${C_RESET}"
  exit 1
fi

if nc -z 127.0.0.1 6379 2>/dev/null; then
  echo -e "   ${C_GREEN}✓ Redis on port 6379 is active.${C_RESET}"
else
  echo -e "   ${C_YELLOW}⚠ Redis on port 6379 is not running. (Queues will fall back where supported)${C_RESET}"
fi

# 3. Clean stale node processes on ports 3000 & 5001 if any exist
echo -e "\n${C_BOLD}🧹 [2/5] Checking and clearing ports 5001 & 3000...${C_RESET}"
for PORT in 5001 3000; do
  PID=$(lsof -ti :$PORT 2>/dev/null || true)
  if [ -n "$PID" ]; then
    echo -e "   Port $PORT occupied by PID(s): $PID. Gracefully terminating..."
    kill -9 $PID 2>/dev/null || true
    sleep 1
  fi
done
echo -e "   ${C_GREEN}✓ Ports 5001 and 3000 are clear.${C_RESET}"

# 4. Start Auto-Commit Watcher in background
echo -e "\n${C_BOLD}📝 [3/5] Starting Auto-Commit Watcher Service...${C_RESET}"
if [ -f "$WATCHER_SCRIPT" ]; then
  node "$WATCHER_SCRIPT" > "$WORKSPACE_ROOT/watcher.log" 2>&1 &
  WATCHER_PID=$!
  echo -e "   ${C_GREEN}✓ Auto-commit watcher started (PID: $WATCHER_PID). Log: watcher.log${C_RESET}"
else
  echo -e "   ${C_YELLOW}⚠ Watcher script not found, skipping.${C_RESET}"
fi

# 5. Start Backend Server
echo -e "\n${C_BOLD}🚀 [4/5] Starting Backend Express API (Port 5001)...${C_RESET}"
cd "$BACKEND_DIR"
npm run dev > "$WORKSPACE_ROOT/backend-dev.log" 2>&1 &
BACKEND_PID=$!
echo -e "   Waiting for Backend API to initialize and connect to PostgreSQL..."

BACKEND_READY=false
for i in {1..30}; do
  if curl -s http://127.0.0.1:5001/api/health >/dev/null 2>&1 || nc -z 127.0.0.1 5001 2>/dev/null; then
    BACKEND_READY=true
    break
  fi
  sleep 1
done

if [ "$BACKEND_READY" = true ]; then
  echo -e "   ${C_GREEN}✓ Backend API is UP & listening on port 5001 (PID: $BACKEND_PID).${C_RESET}"
else
  echo -e "   ${C_YELLOW}⚠ Backend started (PID: $BACKEND_PID), check backend-dev.log for full details.${C_RESET}"
fi

# 6. Cleanup handler on exit (Ctrl+C)
cleanup() {
  echo -e "\n\n${C_BOLD}${C_YELLOW}Shutting down FingerMobile Dev Services...${C_RESET}"
  kill $BACKEND_PID 2>/dev/null || true
  if [ -n "$WATCHER_PID" ]; then
    kill $WATCHER_PID 2>/dev/null || true
  fi
  # Kill any remaining node instances on 3000 and 5001
  PIDS=$(lsof -ti :3000,:5001 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    kill -9 $PIDS 2>/dev/null || true
  fi
  echo -e "${C_GREEN}All services shut down cleanly.${C_RESET}"
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 7. Print LAN connection details for testing
echo -e "\n${C_BOLD}${C_GREEN}======================================================================${C_RESET}"
echo -e "${C_BOLD}${C_GREEN}  🚀 PLATFORM READY FOR LOCAL & LAN TESTING                          ${C_RESET}"
echo -e "${C_BOLD}${C_GREEN}======================================================================${C_RESET}"
echo -e "  💻 ${C_BOLD}Host PC URL:${C_RESET}     ${C_CYAN}http://localhost:3000${C_RESET}"
echo -e "  📱 ${C_BOLD}LAN Mobile URL:${C_RESET}  ${C_CYAN}http://${LAN_IP}:3000${C_RESET}"
echo -e "  💬 ${C_BOLD}LAN Forum URL:${C_RESET}   ${C_CYAN}http://${LAN_IP}:3000/forum${C_RESET}"
echo -e "  🔐 ${C_BOLD}LAN Mii Chat:${C_RESET}    ${C_CYAN}http://${LAN_IP}:3000/mii${C_RESET}"
echo -e "  ⚙️  ${C_BOLD}Backend API:${C_RESET}     ${C_CYAN}http://${LAN_IP}:5001${C_RESET}"
echo -e "${C_BOLD}${C_GREEN}======================================================================${C_RESET}\n"
echo -e "${C_BOLD}⚡ Starting Frontend React Server in foreground (Ctrl+C to stop all)...${C_RESET}\n"

# 8. Start Frontend in Foreground
cd "$FRONTEND_DIR"
HOST=0.0.0.0 PORT=3000 npm start

