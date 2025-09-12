# MAC Address Spoofer Project Structure & Standards

Complete documentation of the MAC Address Spoofer application's file structure, naming conventions, architectural patterns, and development standards. This document serves as the definitive guide for understanding and maintaining the codebase.

## Project File Structure

```
MAC_Spoofer/
├── src/                           # Source code directory (Electron application)
│   ├── main.js                   # Main Electron process
│   ├── preload.js                # Secure IPC bridge between main and renderer
│   ├── app.js                    # Frontend application logic
│   ├── auth-handler.js           # Cross-platform privilege escalation
│   ├── index.html                # Application UI
│   ├── styles.css                # Dark mode styling and UI design
│   └── universal_mac_spoof.py    # Python backend for MAC address manipulation
│
├── resources/                     # Application assets and resources
│   └── icons/                    # Platform-specific application icons
│       ├── icon.icns            # macOS application icon
│       ├── icon.ico             # Windows application icon
│       └── icon.png             # Cross-platform icon (Linux/fallback)
│
├── scripts/                       # Build and utility scripts
│   ├── compile-build-dist.sh    # Main build script for all platforms
│   ├── run-macos-source.sh      # Run from source on macOS
│   ├── run-macos.sh             # Run compiled binary on macOS
│   ├── run-linux-source.sh      # Run from source on Linux
│   ├── run-linux.sh             # Run compiled binary on Linux
│   ├── run-windows-source.bat   # Run from source on Windows
│   └── run-windows.bat          # Run compiled binary on Windows
│
├── dev/                          # Development documentation
│   ├── PROJECT_STRUCTURE_STANDARDS.md  # This document
│   └── BUILD-COMPILE-DIST-Electron-Build-System.md  # Build system guide
│
├── docs/                         # User documentation
│
├── dist/                         # Compiled binaries and installers (generated)
│   ├── mac/                     # macOS Intel builds
│   ├── mac-arm64/              # macOS ARM64 builds
│   ├── win-unpacked/           # Windows unpacked builds
│   ├── linux-unpacked/         # Linux unpacked builds
│   └── *.{dmg,exe,AppImage}    # Platform installers
│
├── node_modules/                 # Node.js dependencies (generated)
├── package.json                  # Node.js project configuration
├── package-lock.json            # Dependency lock file
├── CLAUDE.md                     # AI assistant guidelines
└── README.md                     # Project documentation
```

## File Naming Conventions

### JavaScript Files
- **Module files**: `kebab-case.js` (e.g., `auth-handler.js`)
- **Class names**: `PascalCase` (e.g., `MACSpooferApp`, `AuthHandler`)
- **Function names**: `camelCase` (e.g., `executeWithAuth()`, `checkAdminPrivileges()`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_INTERFACES`, `PYTHON_COMMANDS`)
- **Private methods**: `_leadingUnderscore` (e.g., `_parseInterfaceOutput()`)

### Configuration Files
- **Package files**: `package.json`, `package-lock.json` (standard Node.js conventions)
- **Documentation**: `UPPERCASE.md` for importance, `lowercase.md` for regular docs
- **Scripts**: `kebab-case.sh/.bat` (e.g., `run-macos-source.sh`)

### Build Artifacts
- **Application name**: `MAC Address Spoofer` (with spaces for display)
- **Binary name**: `mac-address-spoofer` (kebab-case for technical use)
- **Version format**: `MAJOR.MINOR.PATCH` (e.g., `1.0.0`)
- **Platform identifiers**: `mac`, `mac-arm64`, `win-unpacked`, `linux-unpacked`
- **Installer naming**: `[AppName]-[version].[ext]`
  - Example: `MAC-Address-Spoofer-1.0.0.dmg`

## Code Organization Principles

### Architecture Overview
This is an Electron application that provides a modern GUI wrapper around a Python-based MAC address spoofing utility.

#### Main Process (`src/main.js`)
- `MACSpooferApp` class manages the entire application lifecycle
- Handles BrowserWindow creation, menu setup, and app events
- Manages IPC communication between main and renderer processes
- Python script execution and process management
- Cross-platform file path resolution for packaged vs development modes

#### Authentication Handler (`src/auth-handler.js`)
- Cross-platform privilege escalation system
- Windows: UAC elevation via PowerShell `Start-Process -Verb RunAs`
- macOS: osascript with administrator privileges
- Linux: Fallback chain (pkexec → gksudo → kdesudo → sudo)
- Admin privilege detection for all platforms

#### Preload Script (`src/preload.js`)
- Security bridge between main and renderer processes
- Exposes sanitized APIs for MAC address operations
- MAC address validation and random generation utilities
- Context isolation enforcement

#### Renderer Process (`src/app.js`)
- Frontend application logic and UI event handling
- Interface selection and status display
- MAC spoofing operations and user feedback
- Toast notification system and loading states

#### Python Integration (`src/universal_mac_spoof.py`)
- Cross-platform MAC address manipulation (macOS, Windows, Linux)
- Network interface detection and enumeration
- Safe MAC address generation (locally administered addresses)
- Original MAC backup and restore functionality with JSON logging

### Security Architecture
- Context isolation enabled with `nodeIntegration: false`
- Secure IPC communication through preload script
- Platform-specific privilege escalation via AuthHandler
- MAC address format validation and input sanitization
- Admin privilege detection with visual user feedback

## Build System Standards

### Script Responsibilities

#### `compile-build-dist.sh`
Main build orchestrator that:
- Performs comprehensive dependency checks (Node.js, npm, Python)
- Tests application from source before building (mandatory)
- Cleans previous build artifacts
- Builds for all platforms (macOS Intel/ARM, Windows, Linux)
- Creates platform-specific installers (.dmg, .exe, .AppImage)
- Validates build outputs and reports status

#### `run-[platform]-source.sh/.bat`
Development runners that:
- Check for required dependencies
- Install npm packages if needed
- Launch application from source code
- Provide colored status output and error handling
- Enable development tools and debugging

#### `run-[platform].sh/.bat`
Production runners that:
- Detect system architecture (Intel vs ARM on macOS)
- Locate appropriate binary for the platform
- Launch compiled application
- Handle missing binary scenarios gracefully
- Provide user-friendly error messages

### Cross-Platform Considerations

#### macOS
- Supports both Intel (x64) and Apple Silicon (arm64) architectures
- Uses .app bundles with proper Info.plist configuration
- Requires codesigning for distribution (when certificates available)
- DMG installers with drag-to-Applications UI

#### Windows
- Builds for x64 architecture
- Generates both portable .exe and NSIS installer
- UAC elevation handling for MAC spoofing operations
- Embedded icons and application metadata

#### Linux
- Builds for x64 architecture
- AppImage format for universal Linux distribution
- Supports various privilege escalation methods
- Desktop file integration for system menu

## Development Workflow

### Setup Requirements
- Node.js 16+ and npm
- Python 3.x (for MAC spoofing functionality)
- Administrator/sudo privileges for MAC operations
- Platform-specific build tools (Xcode on macOS, Visual Studio Build Tools on Windows)

### Development Cycle
1. Make changes in feature branch
2. Test locally: `./scripts/run-[platform]-source.sh`
3. Verify functionality with different network interfaces
4. Build all platforms: `./scripts/compile-build-dist.sh`
5. Test generated binaries: `./scripts/run-[platform].sh`
6. Validate installers on target systems

### Testing Requirements
- **Source Testing**: Mandatory before any build process
- **Interface Detection**: Verify network interface enumeration
- **MAC Validation**: Test MAC address format validation
- **Privilege Checking**: Confirm admin privilege detection
- **Cross-Platform**: Test on macOS, Windows, and Linux where possible

## Error Handling Strategy

### Graceful Degradation
1. **Python not found** → Clear error with installation instructions
2. **No admin privileges** → Visual warning with elevation guidance
3. **Interface not found** → Refresh option with user feedback
4. **MAC spoofing fails** → Detailed error message with troubleshooting steps

### User Experience
- Clear visual indicators for admin status (✅/⚠️)
- Toast notifications for operation success/failure
- Loading states during potentially slow operations
- Helpful error messages with suggested solutions

## Security Considerations

### Input Validation
- MAC address format validation (regex-based)
- Interface name sanitization
- Command argument escaping for Python subprocess calls
- Path validation to prevent directory traversal

### Privilege Management
- Automatic admin privilege detection
- Platform-appropriate elevation prompts
- Graceful handling of elevation denial
- Clear user communication about privilege requirements

### Safe Defaults
- Generate locally administered MAC addresses only
- Preserve original MAC addresses in backup system
- Validate all user inputs before processing
- Limit file system access to application directories

## Platform-Specific Considerations

### macOS Specific
- App Transport Security considerations for future network features
- Sandboxing compatibility (currently disabled for admin access)
- Notarization requirements for distribution outside App Store
- Support for both Intel and Apple Silicon architectures

### Windows Specific
- UAC integration for privilege escalation
- PowerShell execution policy considerations
- Visual C++ redistributable dependencies
- Windows Defender SmartScreen compatibility

### Linux Specific
- Multiple desktop environment support (GNOME, KDE, etc.)
- Various privilege escalation tool availability
- AppImage portability across distributions
- X11/Wayland display server compatibility

## Maintenance Guidelines

### Regular Tasks
- Update Electron version quarterly for security patches
- Update Node.js dependencies monthly
- Test on new OS versions when released
- Review Python script compatibility with OS updates

### Documentation Standards
- Keep CLAUDE.md updated with architectural changes
- Update README.md with new features or requirements
- Document breaking changes in development notes
- Maintain accurate build instruction documentation

This document represents the complete structural and organizational standards for the MAC Address Spoofer project. All contributions should adhere to these guidelines to maintain consistency, security, and quality.