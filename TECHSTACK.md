# Technology Stack

## Project Overview
Cross-platform MAC address spoofing utility with modern dark-themed GUI built using Electron framework.

## Core Technologies

### Frontend Framework
- **Electron 27.0.0** - Cross-platform desktop application framework
- **HTML5** - Modern semantic markup
- **CSS3** - Responsive styling with CSS custom properties and modern layout techniques
- **Vanilla JavaScript (ES6+)** - Client-side logic without external UI frameworks

### Backend & Core Logic
- **Node.js** - JavaScript runtime for Electron main process
- **Python 3** - System-level network interface manipulation and MAC address spoofing
- **Child Process API** - Node.js child_process module for Python script execution

### Data & Storage
- **Electron Store 8.1.0** - Persistent application settings and configuration storage
- **JSON** - Data serialization for logs and configuration files

### Build & Development Tools
- **Electron Builder 24.6.4** - Application packaging and distribution
- **npm** - Package management and build scripts
- **Shell Scripts** - Cross-platform build automation (Bash/Batch)

### System Integration
- **Operating System APIs**
  - **macOS**: `ifconfig` and network service management
  - **Windows**: `netsh` interface configuration
  - **Linux**: `ifconfig` and network interface manipulation
- **Admin/Root Privilege Management** - Platform-specific privilege escalation
- **IPC (Inter-Process Communication)** - Electron main/renderer process communication

## Architecture

### Application Structure
```
┌─────────────────┐
│   Electron GUI  │ ← HTML/CSS/JS Frontend
├─────────────────┤
│   Main Process  │ ← Node.js Application Logic
├─────────────────┤
│  Python Script  │ ← System-level MAC Spoofing
└─────────────────┘
```

### Key Components
- **Main Process** (`main.js`) - Electron application lifecycle and window management
- **Renderer Process** (`app.js`) - UI logic and user interactions
- **Preload Script** (`preload.js`) - Secure context bridge for IPC
- **Authentication Handler** (`auth-handler.js`) - Privilege management
- **Python Backend** (`universal_mac_spoof.py`) - Cross-platform MAC spoofing

## Development Features

### Security
- **Context Isolation** - Secure renderer process isolation
- **No Node Integration** - Disabled in renderer for security
- **Preload Script** - Controlled API exposure via context bridge
- **Admin Privilege Validation** - Secure privilege escalation

### User Interface
- **Dark Theme** - Modern dark UI with CSS custom properties
- **Responsive Design** - Adaptive layout for different window sizes
- **Native Look & Feel** - Platform-specific styling and behaviors
- **Real-time Status Updates** - Live interface monitoring

### Cross-Platform Support
- **macOS** - DMG and ZIP distribution, native window controls
- **Windows** - NSIS installer and ZIP, Windows-specific networking
- **Linux** - AppImage distribution, Linux network tools

## Build Targets

### macOS
- **Architecture**: x64, ARM64 (Apple Silicon)
- **Formats**: DMG installer, ZIP archive
- **Icon**: ICNS format

### Windows
- **Architecture**: x64
- **Formats**: NSIS installer, ZIP archive
- **Icon**: ICO format

### Linux
- **Architecture**: x64
- **Format**: AppImage portable application
- **Icon**: PNG format

## External Dependencies

### System Requirements
- **Python 3.x** - Required for MAC spoofing functionality
- **Administrative Privileges** - Required for network interface modification
- **Network Interfaces** - Physical or virtual network adapters

### Fonts & Assets
- **Inter Font Family** - Modern typography from Google Fonts
- **Custom Icons** - Platform-specific application icons
- **Emoji Icons** - Unicode symbols for UI elements

## Development Workflow

### Scripts
- `npm start` - Run application in development mode
- `npm run dev` - Run with development flags
- `npm run dist` - Build for all platforms
- `npm run dist:mac` - Build macOS-specific
- `npm run dist:win` - Build Windows-specific
- `npm run dist:linux` - Build Linux-specific

### File Organization
```
src/
├── main.js              # Electron main process
├── app.js               # Frontend application logic
├── auth-handler.js      # Authentication management
├── preload.js           # Secure context bridge
├── index.html           # Application UI markup
├── styles.css           # Application styling
└── universal_mac_spoof.py # Python MAC spoofing backend

scripts/
├── compile-build-dist.sh    # Build automation
├── run-macos.sh            # macOS execution
├── run-windows.bat         # Windows execution
└── run-linux.sh           # Linux execution
```

## Version Information
- **Application Version**: 1.0.0
- **Electron Version**: 27.0.0
- **Target Platforms**: macOS 10.14+, Windows 10+, Linux (modern distributions)
- **License**: MIT License