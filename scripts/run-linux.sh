#!/bin/bash

# Run MAC Address Spoofer from Compiled Binary - Linux
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

# Function to detect distribution
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$NAME"
    else
        echo "Unknown Linux"
    fi
}

print_status "🚀 Launching compiled MAC Address Spoofer application..."

# Check if we're on Linux
if [ "$(uname)" != "Linux" ]; then
    print_error "This script is designed for Linux only"
    print_info "For other platforms, use:"
    print_info "  macOS: ./scripts/run-macos.sh"
    print_info "  Windows: ./scripts/run-windows.bat"
    exit 1
fi

# Display system information
DISTRO=$(detect_distro)
print_info "Distribution: $DISTRO"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    print_error "No dist/ directory found. Please run ./scripts/compile-build-dist.sh first."
    exit 1
fi

# Look for Linux binaries
APPIMAGE_PATH=""
BINARY_PATH=""
TAR_PATH=""

# Look for AppImage
APPIMAGE_PATH=$(find dist -name "*.AppImage" -type f | head -n 1)
if [ -n "$APPIMAGE_PATH" ]; then
    print_success "Found AppImage: $(basename "$APPIMAGE_PATH")"
fi

# Look for unpacked binary
if [ -d "dist/linux-unpacked" ]; then
    BINARY_PATH=$(find dist/linux-unpacked -name "mac-address-spoofer" -o -name "MAC*" | head -n 1)
    if [ -n "$BINARY_PATH" ]; then
        print_success "Found unpacked binary: $(basename "$BINARY_PATH")"
    fi
fi

# Look for tar.gz
if [ -z "$APPIMAGE_PATH" ] && [ -z "$BINARY_PATH" ]; then
    TAR_PATH=$(find dist -name "*.tar.gz" -type f | head -n 1)
    if [ -n "$TAR_PATH" ]; then
        print_success "Found tar.gz package: $(basename "$TAR_PATH")"
    fi
fi

# Check for X11 display
if [ -z "$DISPLAY" ]; then
    print_error "No X11 display found. Make sure you're running in a graphical environment."
    print_info "If using SSH, try: ssh -X username@hostname"
    exit 1
fi

# Launch the application
if [ -n "$APPIMAGE_PATH" ] && [ -f "$APPIMAGE_PATH" ]; then
    # Make AppImage executable if needed
    if [ ! -x "$APPIMAGE_PATH" ]; then
        print_status "Making AppImage executable..."
        chmod +x "$APPIMAGE_PATH"
    fi
    
    print_success "Launching $APP_NAME from AppImage..."
    print_info "Starting $(basename "$APPIMAGE_PATH")..."
    "$APPIMAGE_PATH" &
    print_success "Application launched successfully!"
    print_info "The app is now running. Check your application menu or desktop."

elif [ -n "$BINARY_PATH" ] && [ -f "$BINARY_PATH" ]; then
    # Make binary executable if needed
    if [ ! -x "$BINARY_PATH" ]; then
        print_status "Making binary executable..."
        chmod +x "$BINARY_PATH"
    fi
    
    print_success "Launching $APP_NAME from unpacked binary..."
    print_info "Starting $(basename "$BINARY_PATH")..."
    "$BINARY_PATH" &
    print_success "Application launched successfully!"
    print_info "The app is now running. Check your application menu or desktop."

elif [ -n "$TAR_PATH" ]; then
    print_warning "No executable found, but tar.gz package is available:"
    print_info "  $(basename "$TAR_PATH")"
    print_info "To install, extract the package first:"
    print_info "  tar -xzf \"$TAR_PATH\""
    print_info "Then run the executable from the extracted directory."
    exit 1

else
    print_error "Could not find $APP_NAME binary for Linux"
    print_info "Available files in dist/:"
    if [ -d "dist" ]; then
        ls -la dist/ | grep -E '\.(AppImage|tar\.gz)' || echo "  No Linux application files found"
    fi
    print_info ""
    print_info "To build the app first, run:"
    print_info "  ./scripts/compile-build-dist.sh"
    print_info ""
    print_info "To run from source instead:"
    print_info "  ./scripts/run-linux-source.sh"
    
    exit 1
fi