#!/bin/bash

# Laboratory of Life - Development Server Starter
# This script starts both backend and frontend development servers

echo "🌱 Starting Laboratory of Life Development Servers..."
echo ""

# Kill any existing processes on ports 3000 and 5173
echo "🧹 Cleaning up existing servers..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
sleep 1

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start backend server in background
echo "🚀 Starting Backend Server (http://localhost:3000)..."
cd "$SCRIPT_DIR/backend"
npm run dev > /tmp/life-lab-backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait a moment for backend to initialize
sleep 2

# Start frontend server in background
echo "🎨 Starting Frontend Server (http://localhost:5173)..."
cd "$SCRIPT_DIR/frontend"
npm run dev > /tmp/life-lab-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait for servers to be ready
echo ""
echo "⏳ Waiting for servers to start..."
sleep 3

# Check if servers are running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend server is running on http://localhost:3000"
else
    echo "❌ Backend server failed to start. Check logs: tail -f /tmp/life-lab-backend.log"
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Frontend server is running on http://localhost:5173"
else
    echo "❌ Frontend server failed to start. Check logs: tail -f /tmp/life-lab-frontend.log"
fi

echo ""
echo "📝 Server PIDs saved:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📋 View logs:"
echo "   Backend:  tail -f /tmp/life-lab-backend.log"
echo "   Frontend: tail -f /tmp/life-lab-frontend.log"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   or run: lsof -ti:3000,5173 | xargs kill -9"
echo ""
echo "🌐 Access the application at: http://localhost:5173"
