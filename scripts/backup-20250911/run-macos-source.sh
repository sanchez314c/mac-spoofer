#!/bin/bash

# Run MAC Address Spoofer from Source - macOS
# Launches the app directly from source code using npm
# MAC Address Spoofer Application - Following Electron Build Standards

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="MAC Address Spoofer"

# Get the script directory and navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✓${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠${NC} $1"
}

print_info() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')] ℹ${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_status "🚀 Starting MAC Address Spoofer from source..."

# Check if we're on macOS
if [ "$(uname)" != "Darwin" ]; then
    print_error "This script is designed for macOS only"
    print_info "For other platforms, use:"
    print_info "  Linux: ./scripts/run-linux-source.sh"
    print_info "  Windows: ./scripts/run-windows-source.bat"
    exit 1
fi

# Check for Node.js
if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    print_info "Visit https://nodejs.org to download and install Node.js"
    exit 1
fi

# Check for npm
if ! command_exists npm; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

# Check for Python 3
if ! command_exists python3 && ! command_exists python; then
    print_error "Python 3 is not installed. Please install Python 3.x."
    print_info "Visit https://www.python.org to download and install Python 3"
    exit 1
fi

# Display system information
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
PYTHON_VERSION=""
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
elif command_exists python; then
    PYTHON_VERSION=$(python --version)
fi

print_info "Node version: $NODE_VERSION"
print_info "npm version: $NPM_VERSION"
print_info "Python version: $PYTHON_VERSION"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_success "Dependencies installed"
else
    print_info "Dependencies already installed"
fi

# Display application information from package.json
if command_exists jq && [ -f "package.json" ]; then
    APP_VERSION=$(jq -r '.version' package.json 2>/dev/null)
    if [ "$APP_VERSION" != "null" ] && [ -n "$APP_VERSION" ]; then
        print_info "Application: $APP_NAME v$APP_VERSION"
    fi
fi

# Launch the app from source
print_status "Launching $APP_NAME from source code..."
print_warning "This will start the app in development mode with admin privilege requirements"
print_info "Press Ctrl+C to stop the application"
echo ""

# Run the app in development mode
npm start

# Check exit code
EXIT_CODE=$?
echo ""
if [ $EXIT_CODE -eq 0 ]; then
    print_success "Application session ended successfully"
else
    print_error "Application terminated with error code: $EXIT_CODE"
fi