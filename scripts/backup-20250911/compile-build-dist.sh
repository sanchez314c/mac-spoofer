#!/bin/bash

# Complete Multi-Platform Build Script for MAC Address Spoofer
# Builds for macOS, Windows, and Linux with all installer types

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to display help
show_help() {
    echo "Complete Multi-Platform Build Script for MAC Address Spoofer"
    echo ""
    echo "Usage: ./scripts/compile-build-dist.sh [options]"
    echo ""
    echo "Options:"
    echo "  --no-clean         Skip cleaning build artifacts"
    echo "  --platform PLAT    Build for specific platform (mac, win, linux, all)"
    echo "  --arch ARCH        Build for specific architecture (x64, ia32, arm64, all)"
    echo "  --quick            Quick build (single platform only)"
    echo "  --skip-test        Skip mandatory testing phase"
    echo "  --help             Display this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/compile-build-dist.sh                    # Full build for all platforms"
    echo "  ./scripts/compile-build-dist.sh --platform win     # Windows only"
    echo "  ./scripts/compile-build-dist.sh --quick            # Quick build for current platform"
    echo "  ./scripts/compile-build-dist.sh --no-clean         # Build without cleaning first"
}

# Parse command line arguments
NO_CLEAN=false
PLATFORM="all"
ARCH="all"
QUICK=false
SKIP_TEST=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-clean)
            NO_CLEAN=true
            shift
            ;;
        --platform)
            PLATFORM="$2"
            shift 2
            ;;
        --arch)
            ARCH="$2"
            shift 2
            ;;
        --quick)
            QUICK=true
            shift
            ;;
        --skip-test)
            SKIP_TEST=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check for required tools
print_status "Checking requirements..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check for Python 3
PYTHON_CMD=""
if command_exists python3; then
    PYTHON_CMD="python3"
elif command_exists python; then
    # Verify it's Python 3
    PYTHON_VERSION=$(python --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1)
    if [ "$PYTHON_VERSION" = "3" ]; then
        PYTHON_CMD="python"
    fi
fi

if [ -z "$PYTHON_CMD" ]; then
    print_error "Python 3 is not installed. Please install Python 3.x first."
    exit 1
fi

print_success "All requirements met"

# Step 1: Clean everything if not skipped
if [ "$NO_CLEAN" = false ]; then
    print_status "🧹 Purging all existing builds..."
    rm -rf dist/
    rm -rf build/
    rm -rf node_modules/.cache/
    rm -rf out/
    print_success "All build artifacts purged"
fi

# Step 2: Install/update dependencies
print_status "📦 Installing/updating dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

# Install electron-builder if not present
if ! npm list electron-builder >/dev/null 2>&1; then
    print_status "Installing electron-builder..."
    npm install --save-dev electron-builder
fi

print_success "Dependencies ready"

# Step 2.5: MANDATORY SOURCE TESTING - Test application from source before building
print_status "🧪 MANDATORY TESTING: Application must work from source before building"
print_warning "This is a REQUIRED step. The build will abort if testing fails."
echo ""

# Check platform and run appropriate test
PLATFORM=$(uname)
if [ "$PLATFORM" = "Darwin" ]; then
    TEST_SCRIPT="./scripts/run-macos-source.sh"
elif [ "$PLATFORM" = "Linux" ]; then
    TEST_SCRIPT="./scripts/run-linux-source.sh"
else
    # Windows or other - assume we can run the source test
    TEST_SCRIPT="npm start"
fi

print_status "Testing on platform: $PLATFORM"
print_status "🚨 TESTING PHASE: Please verify the following functionality:"
echo ""
print_status "✓ Application launches successfully"
print_status "✓ UI renders correctly with dark theme"  
print_status "✓ Network interfaces are detected and listed"
print_status "✓ Admin privilege status is correctly displayed"
print_status "✓ MAC address validation works (try valid/invalid formats)"
print_status "✓ Random MAC generation functions"
print_status "✓ Python script integration is functional"
print_status "✓ Application closes cleanly"
echo ""

print_warning "The application will now launch for testing. Please:"
print_warning "1. Verify all functionality listed above works correctly"
print_warning "2. Close the application when testing is complete"
print_warning "3. You will be asked to confirm if testing passed"
echo ""

read -p "Press [Enter] to start testing, or Ctrl+C to abort..."

# Launch the test
if [ -f "$TEST_SCRIPT" ]; then
    print_status "Launching test using: $TEST_SCRIPT"
    $TEST_SCRIPT
else
    print_status "Launching test using: npm start"
    npm start
fi

echo ""
print_status "Testing phase completed. Please confirm results:"
echo ""

# Get user confirmation that testing passed
while true; do
    read -p "Did the application work correctly during testing? (y/n): " yn
    case $yn in
        [Yy]* ) 
            print_success "✅ Source testing PASSED - Proceeding with build"
            break
            ;;
        [Nn]* ) 
            print_error "❌ Source testing FAILED - Build aborted"
            print_warning "Please fix issues before building:"
            print_warning "• Check Node.js, Python, and dependency installations"
            print_warning "• Review application logs for errors"
            print_warning "• Ensure admin privileges are available"
            print_warning "• Verify network interfaces can be detected"
            exit 1
            ;;
        * ) echo "Please answer yes (y) or no (n).";;
    esac
done

echo ""

# Step 3: Build all platform binaries and packages
print_status "🏗️  Building all platform binaries and packages..."
print_status "Building: macOS (Intel + ARM), Windows (x64), Linux (x64)"

# Use npm run dist to build for all platforms
npm run dist
BUILD_RESULT=$?

if [ $BUILD_RESULT -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_success "All platform builds completed successfully"

# Step 4: Display build results
print_status "📋 Build Results:"
if [ -d "dist" ]; then
    echo ""
    print_status "📁 Generated binaries and packages:"
    
    # List all installer and package files
    find dist -type f \( -name "*.dmg" -o -name "*.exe" -o -name "*.AppImage" -o -name "*.zip" \) ! -name "*.blockmap" -exec ls -lh {} \; | while read -r line; do
        filename=$(echo "$line" | awk '{print $NF}' | sed 's|.*/||')
        filesize=$(echo "$line" | awk '{print $5}')
        echo -e "   ${GREEN}✓${NC} $filename ($filesize)"
    done
    
    echo ""
    print_status "📊 Platform Summary:"
    
    # Check for macOS builds
    if [ -d "dist/mac" ] || [ -d "dist/mac-arm64" ] || find dist -name "*.dmg" -type f | grep -q .; then
        print_success "macOS builds: ✓"
        [ -d "dist/mac" ] && echo "   - Intel: dist/mac/ (.app bundle)"
        [ -d "dist/mac-arm64" ] && echo "   - ARM64: dist/mac-arm64/ (.app bundle)"
        find dist -name "*.dmg" -type f | while read -r dmg; do
            echo "   - Installer: $(basename "$dmg")"
        done
    fi
    
    # Check for Windows builds
    if [ -d "dist/win-unpacked" ] || find dist -name "*.exe" -type f | grep -q .; then
        print_success "Windows builds: ✓"
        [ -d "dist/win-unpacked" ] && echo "   - Unpacked: dist/win-unpacked/"
        find dist -name "*.exe" -type f | while read -r exe; do
            echo "   - Installer: $(basename "$exe")"
        done
        find dist -name "*-win.zip" -type f | while read -r zip; do
            echo "   - Portable: $(basename "$zip")"
        done
    fi
    
    # Check for Linux builds
    if [ -d "dist/linux-unpacked" ] || find dist -name "*.AppImage" -type f | grep -q .; then
        print_success "Linux builds: ✓"
        [ -d "dist/linux-unpacked" ] && echo "   - Unpacked: dist/linux-unpacked/"
        find dist -name "*.AppImage" -type f | while read -r appimage; do
            echo "   - AppImage: $(basename "$appimage")"
        done
    fi
    
    echo ""
    print_status "📄 Auto-update files:"
    for yml in dist/*.yml; do
        if [ -f "$yml" ]; then
            echo "   - $(basename "$yml")"
        fi
    done
else
    print_warning "No dist directory found. Build may have failed."
fi

echo ""
print_success "🎉 Complete build process finished!"
print_status "📁 All binaries and packages are in: ./dist/"
print_status "🌍 Platforms built: macOS (Intel+ARM), Windows (x64), Linux (x64)"
print_status ""
print_status "To run the app:"
print_status "  From source: ./run-macos-source.sh"
print_status "  From binary: ./run-macos.sh"