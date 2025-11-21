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