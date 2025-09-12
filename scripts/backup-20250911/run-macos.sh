#!/bin/bash

# Run MAC Address Spoofer from Compiled Binary - macOS
# Launches the compiled application from dist folder

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

print_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ✗${NC} $1"
}

print_info() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')] ℹ${NC} $1"
}

# Function to detect architecture
detect_arch() {
    local arch=$(uname -m)
    if [ "$arch" = "arm64" ]; then
        echo "arm64"
    else
        echo "x64"
    fi
}

print_status "🚀 Launching compiled MAC Address Spoofer application..."

# Check if we're on macOS
if [ "$(uname)" != "Darwin" ]; then
    print_error "This script is designed for macOS only"
    print_info "For other platforms, use:"
    print_info "  Linux: ./scripts/run-linux.sh"
    print_info "  Windows: ./scripts/run-windows.bat"
    exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    print_error "No dist/ directory found. Please run ./scripts/compile-build-dist.sh first."
    exit 1
fi

# Detect architecture
ARCH=$(detect_arch)
print_info "Detected architecture: $ARCH"

# Look for the appropriate binary
APP_PATH=""
DMG_PATH=""

if [ "$ARCH" = "arm64" ]; then
    # Look for ARM64 app
    if [ -d "dist/mac-arm64" ]; then
        APP_PATH=$(find dist/mac-arm64 -name "*.app" -type d | head -n 1)
        if [ -n "$APP_PATH" ]; then
            print_success "Found ARM64 application: $(basename "$APP_PATH")"
        fi
    fi
    # Look for ARM64 DMG
    if [ -z "$APP_PATH" ]; then
        DMG_PATH=$(find dist -name "*arm64*.dmg" -type f | head -n 1)
        if [ -n "$DMG_PATH" ]; then
            print_success "Found ARM64 DMG installer: $(basename "$DMG_PATH")"
        fi
    fi
else
    # Look for Intel app
    if [ -d "dist/mac" ]; then
        APP_PATH=$(find dist/mac -name "*.app" -type d | head -n 1)
        if [ -n "$APP_PATH" ]; then
            print_success "Found Intel application: $(basename "$APP_PATH")"
        fi
    fi
    # Look for Intel DMG
    if [ -z "$APP_PATH" ]; then
        DMG_PATH=$(find dist -name "*.dmg" -type f ! -name "*arm64*" | head -n 1)
        if [ -n "$DMG_PATH" ]; then
            print_success "Found Intel DMG installer: $(basename "$DMG_PATH")"
        fi
    fi
fi

# If still no app found, look for any .app
if [ -z "$APP_PATH" ] && [ -z "$DMG_PATH" ]; then
    APP_PATH=$(find dist -name "*.app" -type d | head -n 1)
    if [ -n "$APP_PATH" ]; then
        print_warning "Found generic macOS app: $(basename "$APP_PATH")"
    fi
fi

# Launch the application if found
if [ -n "$APP_PATH" ] && [ -d "$APP_PATH" ]; then
    print_success "Launching $APP_NAME..."
    open "$APP_PATH"
    print_success "Application launched successfully!"
    print_info "The app is now running. Check your dock to interact with it."
elif [ -n "$DMG_PATH" ]; then
    print_warning "No .app found, but DMG installer is available:"
    print_info "  $(basename "$DMG_PATH")"
    print_info "To install, double-click the DMG file or run:"
    print_info "  open \"$DMG_PATH\""
    print_info ""
    print_info "Opening DMG now..."
    open "$DMG_PATH"
else
    print_error "Could not find $APP_NAME for your architecture ($ARCH)"
    print_info "Available files in dist/:"
    if [ -d "dist" ]; then
        ls -la dist/ | grep -E '\.(app|dmg|zip)' || echo "  No application files found"
    fi
    print_info ""
    print_info "To build the app first, run:"
    print_info "  ./scripts/compile-build-dist.sh"
    print_info ""
    print_info "To run from source instead:"
    print_info "  ./scripts/run-macos-source.sh"
    
    exit 1
fi