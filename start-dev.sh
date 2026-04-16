#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AI Visibility - Starting Development Environment${NC}"
echo ""

# Kill existing processes on ports 3000 and 8000
echo -e "${YELLOW}🔍 Cleaning up previous processes...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
sleep 1

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start Backend
echo -e "${YELLOW}📦 Starting Backend (port 8000)...${NC}"
cd "$SCRIPT_DIR"
export PYTHONPATH="$SCRIPT_DIR/backend"
./venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# Wait a bit for backend to start
sleep 2

# Start Frontend
echo -e "${YELLOW}🎨 Starting Frontend (port 3000)...${NC}"
cd "$SCRIPT_DIR"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Development Environment Running${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}Backend: http://localhost:8000${NC}"
echo -e "${BLUE}API Docs: http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}Press CTRL+C to stop both services${NC}"
echo ""

# Function to kill both processes on exit
cleanup() {
  echo ""
  echo -e "${RED}🛑 Stopping services...${NC}"
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
  lsof -ti:8000 | xargs kill -9 2>/dev/null || true
  echo -e "${RED}Services stopped${NC}"
  exit 0
}

# Trap CTRL+C and call cleanup
trap cleanup SIGINT

# Wait for all background processes
wait
