# AI Assistant Development Guide

> Development guide and project-specific instructions for AI assistants working on MAC Address Spoofer

## 🤖 Project Overview

**MAC Address Spoofer** is a cross-platform Electron application for secure MAC address spoofing with a modern dark mode GUI. It combines a Python backend for system-level operations with a JavaScript frontend for the user interface.

### Core Architecture
- **Frontend**: Electron 39.x with HTML5/CSS3/JavaScript (ES2022)
- **Backend**: Python 3.x script for system-level MAC operations
- **Build System**: electron-builder 26.x with multi-platform support
- **Security**: Context isolation, preload scripts, admin privilege detection

## 🎯 AI Assistant Guidelines

### Key Development Commands
```bash
# Development & Testing
npm run dev                    # Start with DevTools for debugging
npm start                      # Normal application start
npm run pack                   # Test build without packaging

# Building & Distribution
npm run build:production       # Full production build for all platforms
npm run build:quick           # Quick build for current platform only
npm run build:mac-only        # macOS builds only
npm run build:win-only        # Windows builds only
npm run build:linux-only      # Linux builds only

# Maintenance & Optimization
npm run deps:update           # Update all dependencies
npm run deps:check            # Check for outdated packages
npm run deps:audit            # Security vulnerability scan
npm run bloat-check           # Analyze package sizes
npm run clean                 # Clean build artifacts
npm run temp-clean            # Clean system temp files
```

### File Structure Priority
```
src/
├── main.js           # ⚡ Primary entry point - modify first for backend changes
├── preload.js        # 🔒 Security bridge - modify carefully for API changes
├── app.js           # 🎨 Frontend logic - primary UI modification target
├── index.html       # 📋 UI structure - modify for layout changes
├── styles.css       # 🎨 Styling - modify for visual changes
├── auth-handler.js  # 🔐 Authentication - modify for privilege changes
└── universal_mac_spoof.py  # 🐍 Backend - modify for MAC operation changes

scripts/
├── compile-build-dist.sh  # 🏗️ Master build script - enhance for build improvements
├── bloat-check.sh         # 📊 Dependency analysis - enhance for monitoring
└── temp-cleanup.sh        # 🧹 Cleanup script - enhance for system maintenance

docs/                      # 📚 All documentation - enhance for clarity
build-resources/           # 🖼️ Icons and assets - modify for branding
```

## 🔧 Development Workflow Rules

### Before Making Changes
1. **ALWAYS read existing code completely** - don't skim or assume structure
2. **Create backups** before modifying critical files
3. **Understand the security model** - context isolation is enabled
4. **Check platform-specific code** - macOS/Windows/Linux differences matter

### Security Requirements
- **NEVER disable context isolation** in main.js
- **ALWAYS use preload.js** for any main-to-renderer communication
- **VALIDATE all user input** before passing to Python script
- **SANITIZE interface names** to prevent command injection
- **CHECK admin privileges** before attempting MAC operations

### Code Quality Standards
- **Use async/await** instead of callbacks for readability
- **Add JSDoc comments** for all public functions
- **Handle errors gracefully** with try/catch blocks
- **Use const/let** instead of var
- **Follow ES2022+ standards** consistently

## 🎯 Common Tasks & Solutions

### Adding New UI Features
1. Modify `src/index.html` for structure
2. Update `src/styles.css` for styling
3. Add logic in `src/app.js` for behavior
4. If needed, add IPC handlers in `src/main.js`
5. Expose APIs in `src/preload.js` if required

### Adding New MAC Operations
1. Update `src/universal_mac_spoof.py` first
2. Add IPC handler in `src/main.js`
3. Expose API in `src/preload.js`
4. Implement UI in `src/app.js`
5. Test on all target platforms

### Updating Build Configuration
1. Modify `package.json` build section
2. Test with `npm run build:quick`
3. Verify all platforms with `npm run build:production`
4. Check package sizes with `npm run bloat-check`

### Dependency Management
1. **Check current versions**: `npm run deps:check`
2. **Security audit**: `npm run deps:audit`
3. **Update carefully**: `npm run deps:update`
4. **Test thoroughly**: `npm run build:production`

## 🚨 Critical Security Notes

### NEVER Do These
- **Don't disable Node integration** in renderer process
- **Don't use eval()** or similar dangerous functions
- **Don't pass unsanitized input** to Python script
- **Don't hardcode credentials** or sensitive data
- **Don't disable context isolation**

### ALWAYS Do These
- **Validate MAC address format** before processing
- **Sanitize interface names** before system calls
- **Check admin privileges** before operations
- **Use secure IPC** through preload script
- **Handle errors gracefully** without exposing system details

## 🔍 Debugging Guide

### Common Issues & Solutions

**Application Won't Start**
```bash
# Check Node.js version
node --version  # Should be 18.x or later

# Verify dependencies
npm install

# Check Python PATH
python3 --version
which python3
```

**Python Script Not Found**
```bash
# Verify script exists
ls -la src/universal_mac_spoof.py

# Test Python script directly
python3 src/universal_mac_spoof.py --list

# Check Python path in main.js
```

**Permission Issues**
```bash
# macOS: Check sudo access
sudo -v

# Windows: Run as Administrator
# Right-click -> Run as administrator

# Linux: Verify sudo
sudo whoami
```

**Build Failures**
```bash
# Clean everything
npm run clean:all

# Check dependencies
npm install

# Try quick build first
npm run build:quick
```

## 📱 Platform-Specific Considerations

### macOS Development
- **Testing**: Test on both Intel and Apple Silicon
- **Notarization**: Build for distribution requires Apple Developer account
- **Python**: Use `python3` explicitly, not `python`
- **Sudo**: Required for all MAC operations

### Windows Development
- **Testing**: Test on Windows 10/11, both x64 and x86
- **PowerShell**: Used for some system operations
- **Admin**: Run as Administrator for testing
- **Python**: Must be in system PATH

### Linux Development
- **Testing**: Test on multiple distributions (Ubuntu, Fedora, Arch)
- **Dependencies**: May require system packages for network tools
- **Sudo**: Required for MAC operations
- **Python**: Usually `python3`, but verify distribution

## 🏗️ Build System Deep Dive

### electron-builder Configuration
The build system is configured in `package.json` under the `build` section:

```json
{
  "build": {
    "appId": "com.jasonpaulmichaels.macspoofer",
    "productName": "MAC Address Spoofer",
    "compression": "maximum",
    "files": [
      "src/**/*",
      "!**/*.ts",
      "!**/*.map"
    ],
    "extraResources": [
      "src/universal_mac_spoof.py"
    ]
  }
}
```

### Build Script Features
The `scripts/compile-build-dist.sh` script includes:
- **Multi-platform compilation** (macOS, Windows, Linux)
- **Multiple architectures** (x64, arm64, ia32, armv7l)
- **Package formats** (DMG, EXE, MSI, AppImage, DEB, RPM, SNAP)
- **Bloat analysis** and optimization
- **Temporary file management**
- **Parallel build optimization**

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Application starts without errors
- [ ] Network interfaces are detected
- [ ] Admin privilege detection works
- [ ] MAC address generation works
- [ ] MAC spoofing succeeds with admin rights
- [ ] Error handling works without admin rights
- [ ] UI updates correctly
- [ ] Toast notifications display
- [ ] Application closes cleanly

### Cross-Platform Testing
1. **Build all platforms**: `npm run build:production`
2. **Test package installation** on target OS
3. **Verify MAC operations** work correctly
4. **Check UI responsiveness** on different screen sizes
5. **Validate error messages** are helpful

## 📊 Performance Optimization

### Bundle Size Management
```bash
# Check current sizes
npm run bloat-check

# Analyze dependencies
npm ls --depth=0

# Remove unused packages
npm prune

# Optimize build files configuration
# Edit package.json build.files section
```

### Runtime Performance
- **Lazy load** components when possible
- **Use event delegation** for dynamic content
- **Clean up event listeners** on component destruction
- **Optimize Python script** execution time
- **Cache interface lists** to reduce system calls

## 🔄 Version Management

### Updating Dependencies
1. **Check what's outdated**: `npm run deps:check`
2. **Security audit**: `npm run deps:audit`
3. **Update major versions carefully** - may introduce breaking changes
4. **Test thoroughly** after updates
5. **Update documentation** if APIs change

### Version Bumping
1. **Update package.json version**
2. **Update CHANGELOG.md**
3. **Test full build**: `npm run build:production`
4. **Tag release in Git**
5. **Update documentation**

## 📝 Documentation Maintenance

### Keep These Updated
- **README.md**: Installation, usage, features
- **CHANGELOG.md**: Version history, changes
- **DEVELOPMENT.md**: Development setup, architecture
- **CLAUDE.md**: This file - AI assistant guidance
- **API docs**: In docs/api/ directory
- **Architecture docs**: In docs/architecture/ directory

### Documentation Standards
- **Clear, concise language**
- **Code examples** for common tasks
- **Platform-specific instructions**
- **Troubleshooting sections**
- **Links to additional resources**

---

## 🚀 Quick Reference

### Essential Commands
```bash
npm run dev                    # Start development
npm run build:production      # Build for distribution
npm run bloat-check          # Check package sizes
npm run deps:audit           # Security check
npm run clean:all            # Clean everything
```

### Key Files
- `src/main.js` - Main process, Python integration
- `src/app.js` - UI logic, event handling
- `src/preload.js` - Security bridge, API exposure
- `src/universal_mac_spoof.py` - MAC operations
- `package.json` - Dependencies, build config

### Security Checklist
- [ ] Context isolation enabled
- [ ] Input validation implemented
- [ ] Admin privilege checking
- [ ] Secure IPC communication
- [ ] No hardcoded secrets

**Happy coding! 🎉**