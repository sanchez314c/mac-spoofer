# Documentation Index

> Complete documentation navigation for MAC Address Spoofer

## 📚 Quick Navigation

### 🚀 Getting Started

- **[README.md](../README.md)** - Project overview, installation, and basic usage
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide for users
- **[INSTALLATION.md](INSTALLATION.md)** - Detailed installation instructions
- **[FAQ.md](FAQ.md)** - Frequently asked questions

### 🛠️ Development Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to the project
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Comprehensive development setup and workflow
- **[AGENTS.md](../AGENTS.md)** - AI assistant development guidance
- **[WORKFLOW.md](WORKFLOW.md)** - Development and release workflows

### 📖 Technical Documentation

- **[API.md](API.md)** - Complete API documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design patterns
- **[TECHSTACK.md](TECHSTACK.md)** - Technology stack and architecture details
- **[BUILD_COMPILE.md](BUILD_COMPILE.md)** - Build configuration and customization

## 🏗️ Architecture & Standards

### Core Architecture

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - High-level system design
- **[API.md](API.md)** - API specifications and interfaces
- **[TECHSTACK.md](TECHSTACK.md)** - Technology stack details

### Development Standards

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Coding standards and conventions
- **[WORKFLOW.md](WORKFLOW.md)** - Development workflows and processes
- **[LEARNINGS.md](LEARNINGS.md)** - Development insights and lessons learned

## 🔧 Build System

### Build Configuration

- **[BUILD_COMPILE.md](BUILD_COMPILE.md)** - Comprehensive build system documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment instructions and platform-specific builds

### Build Scripts

```bash
# Primary build commands
npm run build:production     # Full production build
npm run build:quick         # Quick build for current platform
npm run build:mac-only      # macOS builds only
npm run build:win-only      # Windows builds only
npm run build:linux-only    # Linux builds only

# Development and testing
npm run dev                 # Development mode with DevTools
npm run pack               # Build without packaging
npm run clean              # Clean build artifacts
```

## 🔒 Security

### Security Documentation

- **[SECURITY.md](SECURITY.md)** - Security architecture, policies, and best practices
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community guidelines and conduct

### Security Features

- **Context Isolation** - Renderer process sandboxing
- **Secure IPC** - Safe inter-process communication
- **Input Sanitization** - Command injection prevention
- **Privilege Detection** - Admin privilege verification

## 📱 Platform Support

### Platform-Specific Documentation

- **[macOS Development](#macos-development)** - macOS-specific features and setup
- **[Windows Development](#windows-development)** - Windows-specific features and setup
- **[Linux Development](#linux-development)** - Linux-specific features and setup

### Platform Requirements

#### macOS

- **Version**: macOS 10.15+ (Catalina)
- **Architecture**: Intel x64, Apple Silicon (ARM64)
- **Python**: Python 3.x with system PATH
- **Privileges**: sudo access required for MAC operations

#### Windows

- **Version**: Windows 10+ (1903+ recommended)
- **Architecture**: x64, x86 (IA32)
- **Python**: Python 3.x added to PATH
- **Privileges**: Administrator access required

#### Linux

- **Distributions**: Ubuntu 18.04+, Fedora 30+, Arch Linux
- **Architecture**: x64, ARM64, ARMv7l
- **Python**: Python 3.x
- **Privileges**: sudo access required

## 🎯 User Guides

### End User Documentation

- **[QUICK_START.md](QUICK_START.md)** - Quick start guide
- **[INSTALLATION.md](INSTALLATION.md)** - Step-by-step installation instructions
- **[FAQ.md](FAQ.md)** - Frequently asked questions
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

### Administrator Guide

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Enterprise deployment instructions
- **[SECURITY.md](SECURITY.md)** - Security configuration and policies

## 🔌 API Documentation

### Complete API Reference

- **[API.md](API.md)** - Comprehensive API documentation
- **[IPC API](#ipc-api)** - Inter-process communication APIs
- **[Python Script API](#python-script-api)** - Backend script command-line interface
- **[UI Component Events](#ui-component-events)** - Frontend event system

### API Quick Reference

#### Network Interface APIs

```javascript
// Get all network interfaces
window.api.getNetworkInterfaces();

// Refresh interface list
window.api.refreshInterfaces();

// Check admin privileges
window.api.checkAdminPrivileges();
```

#### MAC Address Operations

```javascript
// Generate random MAC
window.api.generateRandomMac();

// Validate MAC address
window.api.validateMacAddress(mac);

// Spoof MAC address
window.api.spoofMacAddress(interface, mac);

// Restore original MAC
window.api.restoreOriginalMac(interface);
```

## 🧪 Testing

### Testing Documentation

- **[Testing Strategy](#testing-strategy)** - Testing methodology and approach
- **[Manual Testing](#manual-testing)** - Manual testing procedures
- **[Automated Testing](#automated-testing)** - Automated test setup (future)
- **[Platform Testing](#platform-testing)** - Cross-platform testing procedures

### Testing Checklist

- [ ] Application starts without errors
- [ ] Network interfaces detected correctly
- [ ] Admin privilege detection works
- [ ] MAC address generation functions
- [ ] MAC spoofing succeeds with privileges
- [ ] Error handling works without privileges
- [ ] UI updates correctly
- [ ] Toast notifications display
- [ ] Application closes cleanly

## 📊 Performance

### Performance Documentation

- **[Performance Optimization](#performance-optimization)** - Performance tuning guidelines
- **[Bundle Size Analysis](#bundle-size-analysis)** - Package size optimization
- **[Memory Management](#memory-management)** - Memory usage optimization
- **[Startup Performance](#startup-performance)** - Application startup optimization

### Performance Tools

```bash
# Check bundle size and dependencies
npm run bloat-check

# Analyze package contents
npm ls --depth=0

# Performance profiling
npm run dev  # Use DevTools profiling
```

## 🔄 Maintenance

### Maintenance Documentation

- **[Dependency Management](#dependency-management)** - Keeping dependencies updated
- **[Version Management](#version-management)** - Version bumping and releases
- **[Documentation Maintenance](#documentation-maintenance)** - Keeping docs current
- **[Backup Procedures](#backup-procedures)** - Data backup and recovery

### Maintenance Commands

```bash
# Update dependencies
npm run deps:update

# Check for security issues
npm run deps:audit

# Clean temporary files
npm run temp-clean

# Full cleanup
npm run clean:all
```

## 📋 Troubleshooting

### Common Issues

#### Application Won't Start

```bash
# Check Node.js version
node --version  # Should be 18.x or later

# Verify dependencies
npm install

# Check Python installation
python3 --version
```

#### Permission Issues

```bash
# macOS: Check sudo access
sudo -v

# Windows: Run as Administrator
# Right-click shortcut → Run as administrator

# Linux: Check sudo access
sudo whoami
```

#### Build Failures

```bash
# Clean build artifacts
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try quick build first
npm run build:quick
```

#### Interface Detection Issues

```bash
# Test Python script directly
python3 src/universal_mac_spoof.py --list

# Refresh interface list in app
# Click refresh button or use API:
window.api.refreshInterfaces()
```

## 🛠️ Development Tools

### Essential Tools

- **[Visual Studio Code](https://code.visualstudio.com/)** - Recommended IDE
- **[Electron DevTools](https://electronjs.org/docs/tutorial/devtools-extension)** - Electron debugging
- **[Chrome DevTools](https://developer.chrome.com/docs/devtools/)** - Web debugging
- **[Python IDLE/PyCharm](https://www.jetbrains.com/pycharm/)** - Python development

### VS Code Extensions

- **Electron** - Electron development support
- **Prettier** - Code formatting
- **ESLint** - Linting (when configured)
- **Python** - Python language support

### Debugging Setup

```bash
# Start with DevTools
npm run dev

# Enable detailed logging
# Set DEBUG=1 environment variable

# Python script debugging
python3 src/universal_mac_spoof.py --help
```

## 📚 Additional Resources

### Official Documentation

- **[Electron Documentation](https://electronjs.org/docs)** - Official Electron docs
- **[electron-builder Guide](https://electron.build/)** - Build tool documentation
- **[Python Documentation](https://docs.python.org/3/)** - Python language reference

### Community Resources

- **[Electron Discord](https://discord.gg/electron)** - Community chat
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/electron)** - Q&A
- **[GitHub Discussions](https://github.com/electron/electron/discussions)** - Discussions

### Related Projects

- **[Network Tools](https://github.com/topics/network-tools)** - Similar tools
- **[MAC Address Utilities](https://github.com/topics/mac-address)** - MAC utilities
- **[Electron Apps](https://github.com/topics/electron-app)** - Example Electron apps

## 🗂️ File Structure

### Complete Project Structure

```
MAC Spoofer/
├── 📁 src/                          # Source code
│   ├── main.js                      # Electron main process
│   ├── preload.js                   # Security bridge
│   ├── index.html                   # UI structure
│   ├── styles.css                   # Dark mode styling
│   ├── app.js                       # Frontend logic
│   ├── auth-handler.js              # Authentication
│   └── universal_mac_spoof.py       # Python backend
├── 📁 scripts/                      # Build and utility scripts
│   ├── compile-build-dist.sh        # Master build script
│   ├── bloat-check.sh               # Dependency analysis
│   ├── temp-cleanup.sh              # System cleanup
│   ├── run-macos*.sh                # macOS runners
│   ├── run-windows*.bat             # Windows runners
│   └── run-linux*.sh                # Linux runners
├── 📁 docs/                         # Documentation
│   ├── development/                 # Development docs
│   ├── architecture/                # Architecture docs
│   ├── api/                         # API documentation
│   └── guides/                      # User guides
├── 📁 resources/                    # Application resources & build assets
│   ├── icons/                       # Application icons
│   │   ├── icon.icns                # macOS icon
│   │   ├── icon.ico                 # Windows icon
│   │   └── icon.png                 # Linux/Source icon
│   └── screenshots/                 # Application screenshots
├── 📁 tests/                        # Test files (future)
├── 📄 README.md                     # Main documentation
├── 📄 CLAUDE.md                     # AI assistant guide
├── 📄 CONTRIBUTING.md               # Contribution guidelines
├── 📄 LICENSE                       # License information
├── 📄 CHANGELOG.md                  # Version history
├── 📄 package.json                  # Project configuration
└── 📄 .gitignore                    # Git ignore rules
```

---

## 🎯 Quick Start

### For Users

1. **Download** the appropriate package from the [Releases](https://github.com/jasonpaulmichaels/MAC_Spoofer/releases) page
2. **Install** following the platform-specific instructions
3. **Run** as Administrator/sudo
4. **Select** a network interface and generate/spoof MAC address

### For Developers

1. **Clone** the repository
2. **Install** dependencies: `npm install`
3. **Run** in development: `npm run dev`
4. **Read** [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup

### For AI Assistants

1. **Read** [AGENTS.md](../AGENTS.md) for AI-specific guidance
2. **Follow** security guidelines strictly
3. **Use** documented APIs and patterns
4. **Test** thoroughly across platforms

---

**Last Updated: October 31, 2025**
**Version: 1.0.0**
