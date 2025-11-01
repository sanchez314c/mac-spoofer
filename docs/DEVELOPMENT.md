# Development Guide

> Comprehensive development setup and workflow for MAC Address Spoofer

## 🚀 Quick Start for Developers

### Prerequisites
- **Node.js**: 18.x or later
- **Python**: 3.8 or later
- **npm**: 9.x or later
- **Git**: Latest version
- **Platform-specific**: Administrator/sudo privileges for testing

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/jasonpaulmichaels/MAC_Spoofer.git
   cd mac-spoofer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run in Development Mode**
   ```bash
   npm run dev
   ```

## 🏗️ Architecture Overview

### Application Structure
```
MAC Spoofer/
├── 📁 src/                     # All source code
│   ├── main.js                 # Electron main process
│   ├── preload.js              # Secure IPC bridge
│   ├── index.html              # Main UI structure
│   ├── styles.css              # Dark mode styling
│   ├── app.js                  # Frontend application logic
│   ├── auth-handler.js         # Authentication & privilege handling
│   └── universal_mac_spoof.py  # Python backend for MAC operations
├── 📁 scripts/                 # Build and automation scripts
│   ├── compile-build-dist.sh   # Comprehensive build script
│   ├── bloat-check.sh          # Dependency analysis
│   ├── temp-cleanup.sh         # System cleanup
│   └── run-*.sh/.bat           # Platform-specific runners
├── 📁 docs/                    # Documentation
│   ├── development/            # Development-specific docs
│   ├── architecture/           # System architecture
│   └── api/                    # API documentation
├── 📁 build-resources/         # Build assets (icons, etc.)
├── 📁 resources/               # Application resources
└── 📁 tests/                   # Test files (future)
```

### Core Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES2022)
- **Backend**: Python 3.x with system networking
- **Framework**: Electron 39.x for cross-platform desktop
- **Build System**: electron-builder 26.x
- **Package Manager**: npm 9.x

### Key Components

#### Main Process (`src/main.js`)
- Application lifecycle management
- Window creation and configuration
- Python script execution via subprocess
- IPC handlers for UI operations
- Cross-platform path resolution
- Security context configuration

#### Preload Script (`src/preload.js`)
- Secure bridge between main and renderer
- Context isolation implementation
- API exposure to frontend
- MAC address validation utilities
- Random MAC generation functions

#### Renderer Process (`src/app.js`)
- UI event handling and DOM manipulation
- Network interface discovery
- MAC spoofing operations
- Status notifications and feedback
- Admin privilege detection
- Real-time interface monitoring

#### Python Backend (`src/universal_mac_spoof.py`)
- Cross-platform MAC address operations
- System command execution
- Interface validation
- Error handling and logging

## 🔧 Development Workflow

### Development Commands

```bash
# Development
npm start                    # Start application in normal mode
npm run dev                 # Start with DevTools opened
npm run pack               # Build without packaging (for testing)

# Building
npm run build:quick        # Quick build for current platform
npm run build:production   # Full production build
npm run build:mac-only     # Build for macOS only
npm run build:win-only     # Build for Windows only
npm run build:linux-only   # Build for Linux only

# Utilities
npm run bloat-check        # Analyze dependency sizes
npm run temp-clean         # Clean temporary files
npm run clean              # Clean build artifacts
npm run clean:all          # Clean everything including temp

# Dependencies
npm run deps:update        # Update all dependencies
npm run deps:check         # Check for outdated packages
npm run deps:audit         # Security audit
npm run deps:audit:fix     # Fix security issues

# Platform-specific testing
./scripts/run-macos-source.sh      # macOS development
./scripts/run-windows-source.bat   # Windows development
./scripts/run-linux-source.sh      # Linux development
```

### Code Style & Conventions

#### JavaScript Standards
- **ES2022** features with async/await
- **Strict mode** enabled
- **JSDoc** comments for functions
- **CamelCase** for variables and functions
- **PascalCase** for classes and constructors
- **UPPER_CASE** for constants

#### CSS Standards
- **BEM** methodology for class naming
- **CSS Custom Properties** for theming
- **Flexbox/Grid** for layouts
- **Mobile-first** responsive design
- **Dark mode** as default theme

#### Python Standards
- **PEP 8** compliance
- **Type hints** where applicable
- **Docstrings** for all functions
- **Error handling** with try/catch
- **Logging** for debugging

### File Organization Standards

#### Source Code Layout
```
src/
├── main.js              # Entry point, main process
├── preload.js           # Security bridge
├── index.html           # UI structure
├── styles.css           # Styling and theme
├── app.js               # Frontend logic
├── auth-handler.js      # Authentication logic
└── universal_mac_spoof.py # Python backend
```

#### Scripts Organization
```
scripts/
├── compile-build-dist.sh # Master build script
├── bloat-check.sh        # Dependency analysis
├── temp-cleanup.sh       # System cleanup
├── run-macos*.sh         # macOS runners
├── run-windows*.bat      # Windows runners
└── run-linux*.sh         # Linux runners
```

## 🧪 Testing Strategy

### Manual Testing Workflow

1. **Functionality Testing**
   ```bash
   # Test on all platforms
   npm run build:production

   # Verify package installation
   # Test MAC spoofing operations
   # Check UI responsiveness
   # Validate error handling
   ```

2. **Privilege Testing**
   - Test without admin privileges
   - Test with admin privileges
   - Verify privilege detection
   - Check error messages

3. **Cross-Platform Testing**
   - macOS (Intel and Apple Silicon)
   - Windows (x64 and x86)
   - Linux (various distributions)

### Debugging Tools

#### Electron DevTools
```bash
npm run dev  # Opens with DevTools
```

#### Console Logging
- Main process: Console output in terminal
- Renderer process: DevTools console
- Python script: Standard output/error

#### Common Debugging Scenarios

**Python Script Not Found**
```bash
# Check Python path in main.js
# Verify universal_mac_spoof.py exists in src/
# Test Python script independently
```

**Permission Issues**
```bash
# On macOS: Check sudo access
# On Windows: Run as Administrator
# On Linux: Verify sudo privileges
```

**Interface Detection Issues**
```bash
# Refresh interface list
# Check Python script output
# Verify network adapter status
```

## 🔒 Security Considerations

### Context Isolation
- **Enabled**: Prevents prototype pollution
- **Preload Script**: Secure API exposure only
- **Node Integration**: Disabled in renderer

### Input Validation
- **MAC Addresses**: Format validation with regex
- **Interface Names**: Sanitization and escaping
- **User Input**: XSS prevention

### Privilege Management
- **Detection**: Automatic admin privilege checking
- **Escalation**: Clear user guidance
- **Fallback**: Graceful degradation

## 🚀 Performance Optimization

### Build Optimization
- **Compression**: Maximum compression enabled
- **ASAR**: Packaging for smaller size
- **Files**: Excluded unnecessary files from build
- **Target**: Platform-specific optimizations

### Runtime Performance
- **Lazy Loading**: Components loaded as needed
- **Event Delegation**: Efficient event handling
- **Memory Management**: Proper cleanup on close
- **Async Operations**: Non-blocking UI

### Bundle Size Optimization
```bash
# Check bundle size
npm run bloat-check

# Analyze dependencies
npm ls --depth=0

# Remove unused packages
npm prune
```

## 🔧 Build System Configuration

### electron-builder Configuration
```json
{
  "build": {
    "appId": "com.jasonpaulmichaels.macspoofer",
    "productName": "MAC Address Spoofer",
    "directories": {
      "output": "dist",
      "buildResources": "build-resources"
    },
    "files": [
      "src/**/*",
      "!**/*.ts",
      "!**/*.map",
      "!**/test/**"
    ],
    "extraResources": [
      "src/universal_mac_spoof.py"
    ],
    "compression": "maximum"
  }
}
```

### Platform-Specific Settings

#### macOS
- **Category**: public.app-category.utilities
- **Targets**: DMG, PKG, ZIP
- **Architectures**: x64, arm64, universal
- **Entitlements**: Hardened runtime

#### Windows
- **Targets**: NSIS, MSI, Portable
- **Architectures**: x64, ia32
- **Icon**: build-resources/icon.ico

#### Linux
- **Targets**: AppImage, DEB, RPM, SNAP
- **Architectures**: x64, arm64, armv7l
- **Category**: Network

## 📱 Platform-Specific Development

### macOS Development
```bash
# Requirements
- macOS 10.15+ (Catalina)
- Xcode Command Line Tools
- Python 3.x with proper PATH

# Testing
./scripts/run-macos-source.sh
sudo python3 src/universal_mac_spoof.py --list
```

### Windows Development
```bash
# Requirements
- Windows 10+ with PowerShell
- Python 3.x added to PATH
- Administrator privileges for testing

# Testing
scripts\run-windows-source.bat
python src\universal_mac_spoof.py --list
```

### Linux Development
```bash
# Requirements
- Modern Linux distribution
- Python 3.x
- sudo privileges
- Network management tools

# Testing
./scripts/run-linux-source.sh
sudo python3 src/universal_mac_spoof.py --list
```

## 🔄 Continuous Integration

### Build Verification
```bash
# Full build test
npm run build:production

# Verify all packages generated
ls -la dist/

# Test package installation
# (Platform-specific testing)
```

### Quality Checks
```bash
# Dependency audit
npm run deps:audit

# Bloat analysis
npm run bloat-check

# Clean build verification
npm run clean && npm run build:quick
```

## 📚 Additional Resources

### Documentation
- [Electron Documentation](https://electronjs.org/docs)
- [electron-builder Guide](https://electron.build/)
- [Python Networking](https://docs.python.org/3/library/socket.html)

### Community
- [Electron Discord](https://discord.gg/electron)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/electron)

### Tools
- [DevTools](https://developer.chrome.com/docs/devtools/)
- [Electron Fiddle](https://electronjs.org/fiddle)
- [VS Code Extensions](https://marketplace.visualstudio.com/)

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

**Happy coding! 🎉**