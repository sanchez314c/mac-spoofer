# Technology Stack

## Core Technologies
- **Language**: JavaScript (Node.js)
- **Framework**: Electron 27.3.11
- **Runtime**: Node.js v24.5.0
- **Package Manager**: npm 11.5.1

## Key Dependencies
- **electron**: Desktop application framework
- **electron-builder**: Multi-platform binary builder
- **Python 3.11**: Backend MAC address manipulation
- **child_process**: Node.js process management

## Development Tools
- **Build Tool**: electron-builder
- **Package Manager**: npm
- **Python Integration**: Universal MAC spoofing script
- **Multi-platform Support**: macOS (Intel/ARM), Windows (x64/x86), Linux (x64)

## Architecture Components
- **Main Process**: Electron main process (main.js)
- **Renderer Process**: Web UI with context isolation
- **Preload Script**: Secure IPC bridge
- **Python Backend**: Platform-specific MAC address manipulation
- **Authentication Handler**: Privilege escalation management

## Build Targets
- **macOS**: .app bundles, .dmg installers, portable .zip
- **Windows**: .exe executables, .msi installers, portable .zip
- **Linux**: AppImage, .deb packages, .rpm packages, unpacked binaries

## Project Type
Desktop GUI Application with privileged system operations