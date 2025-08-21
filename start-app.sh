#!/bin/bash

# ========================================
# 🚀 STARTUP SCRIPT FOR DASHBOARD
# ========================================

echo "🚀 Starting Dashboard Application..."
echo "� Starting frontend dashboard"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down dashboard..."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start dashboard
echo "🎯 Starting Dashboard on port 5173..."
cd "$(dirname "$0")/apps/dashboard"
npm run dev

# If we get here, the dashboard process ended
echo "🛑 Dashboard stopped"
