# Installation Guide

> Complete installation instructions for MAC Address Spoofer

## 📦 Installation Options

### Option 1: Pre-built Binaries (Recommended)

#### macOS Installation

1. **Download the appropriate version**:
   - **Intel Mac**: `MAC-Address-Spoofer-1.0.0.dmg`
   - **Apple Silicon (M1/M2)**: `MAC-Address-Spoofer-1.0.0-arm64.dmg`

2. **Install the application**:

   ```bash
   # Mount the DMG
   open MAC-Address-Spoofer-1.0.0.dmg

   # Drag to Applications folder
   # Or run from the mounted volume
   ```

3. **First run setup**:
   ```bash
   # Allow the application to run
   # System Preferences → Security & Privacy → Allow Anyway
   ```

#### Windows Installation

1. **Download the installer**:
   - `MAC-Address-Spoofer-Setup-1.0.0.exe`

2. **Run the installer**:

   ```bash
   # Right-click → "Run as administrator"
   # Follow the installation wizard
   ```

3. **Configure Windows Defender** (if needed):
   ```powershell
   # Add exclusion if blocked
   Add-MpPreference -ExclusionPath "C:\Program Files\MAC Address Spoofer"
   ```

#### Linux Installation

1. **Download the AppImage**:
   - `MAC-Address-Spoofer-1.0.0.AppImage`

2. **Make it executable**:

   ```bash
   chmod +x MAC-Address-Spoofer-1.0.0.AppImage
   ```

3. **Run the application**:
   ```bash
   ./MAC-Address-Spoofer-1.0.0.AppImage
   ```

### Option 2: Package Manager Installation

#### Homebrew (macOS)

```bash
# Install via Homebrew
brew install --cask mac-spoofer

# Run the application
open -a "MAC Address Spoofer"
```

#### Chocolatey (Windows)

```bash
# Install via Chocolatey
choco install mac-spoofer

# Run the application
mac-spoofer
```

#### Snap Store (Linux)

```bash
# Install via Snap
snap install mac-spoofer

# Run the application
snap run mac-spoofer
```

### Option 3: Build from Source

#### Prerequisites

- **Node.js**: 18.x or later
- **Python**: 3.8 or later
- **npm**: 9.x or later
- **Git**: Latest version

#### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/jasonpaulmichaels/MAC_Spoofer.git
cd mac-spoofer

# 2. Install dependencies
npm install

# 3. Run the application
npm start
```

## 🔧 System Requirements

### Minimum Requirements

#### macOS

- **Operating System**: macOS 10.15 (Catalina) or later
- **Processor**: Intel Core 2 Duo or Apple Silicon M1/M2
- **Memory**: 4GB RAM (8GB recommended)
- **Storage**: 200MB free space
- **Permissions**: Administrator/sudo access

#### Windows

- **Operating System**: Windows 10 (version 1903) or later
- **Processor**: x64-compatible processor
- **Memory**: 4GB RAM (8GB recommended)
- **Storage**: 200MB free space
- **Permissions**: Administrator access

#### Linux

- **Operating System**: Modern distribution (Ubuntu 18.04+, Fedora 30+, Arch Linux)
- **Processor**: x64-compatible processor
- **Memory**: 4GB RAM (8GB recommended)
- **Storage**: 200MB free space
- **Permissions**: sudo/root access

### Recommended Requirements

#### For Optimal Performance

- **Processor**: Multi-core processor (4+ cores)
- **Memory**: 8GB RAM or more
- **Storage**: SSD with 1GB+ free space
- **Network**: Active network interface for testing

## 🐍 Python Setup

### macOS Python Installation

```bash
# Install via Homebrew (recommended)
brew install python3

# Verify installation
python3 --version
which python3
```

### Windows Python Installation

1. **Download from python.org**:
   - Visit [python.org](https://www.python.org/downloads/)
   - Download Python 3.8+ installer
   - Run installer with "Add to PATH" option

2. **Verify installation**:
   ```cmd
   python --version
   where python
   ```

### Linux Python Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# Fedora
sudo dnf install python3 python3-pip

# Arch Linux
sudo pacman -S python python-pip

# Verify installation
python3 --version
which python3
```

## 🔒 Security Setup

### macOS Security Configuration

#### Gatekeeper Configuration

```bash
# Allow app from anywhere (temporary)
sudo spctl --master-disable

# Allow specific app
sudo xattr -rd com.apple.quarantine "/Applications/MAC Address Spoofer.app"

# Re-enable Gatekeeper
sudo spctl --master-enable
```

#### Keychain Access

When prompted for keychain access:

1. Click "Always Allow" for Python
2. Click "Allow" for network interface access
3. Enter password if requested

### Windows Security Configuration

#### PowerShell Execution Policy

```powershell
# Check current policy
Get-ExecutionPolicy

# Set to RemoteSigned if needed
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### User Account Control (UAC)

- Run as Administrator for first use
- Configure UAC to allow application
- Add to Windows Defender exclusions if needed

### Linux Security Configuration

#### Package Dependencies

```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip network-manager

# Fedora
sudo dnf install python3 python3-pip NetworkManager

# Arch Linux
sudo pacman -S python python-pip networkmanager
```

#### User Permissions

```bash
# Add user to network group (if needed)
sudo usermod -a -G network $USER

# Verify sudo access
sudo -l
```

## 🚀 First Run Configuration

### Initial Setup

#### 1. Launch Application

```bash
# macOS
open -a "MAC Address Spoofer"

# Windows
"MAC Address Spoofer"

# Linux
./MAC-Address-Spoofer.AppImage
# or
mac-spoofer
```

#### 2. Grant Permissions

- **macOS**: Enter password when prompted
- **Windows**: Click "Yes" on UAC prompt
- **Linux**: Enter password in terminal

#### 3. Verify Setup

1. Check admin status indicator (should be green)
2. Verify network interfaces are detected
3. Test MAC address generation
4. Confirm UI is responsive

### Configuration Files

#### macOS Configuration

```bash
# Application preferences
~/Library/Preferences/com.jasonpaulmichaels.macspoofer.plist

# Application data
~/Library/Application Support/MAC Address Spoofer/

# Logs
~/Library/Logs/MAC Address Spoofer/
```

#### Windows Configuration

```cmd
# Application data
%APPDATA%\MAC Address Spoofer\

# Configuration
%APPDATA%\MAC Address Spoofer\config\

# Logs
%APPDATA%\MAC Address Spoofer\logs\
```

#### Linux Configuration

```bash
# Application data
~/.config/MAC Address Spoofer/

# Configuration
~/.config/MAC Address Spoofer/config/

# Logs
~/.local/share/MAC Address Spoofer/logs/
```

## 🐛 Troubleshooting Installation

### Common Installation Issues

#### macOS Issues

**"Application can't be opened because Apple cannot check it for malicious software"**

```bash
# Solution 1: Right-click → Open
# Solution 2: System Preferences → Security & Privacy → Allow Anyway
# Solution 3: Disable Gatekeeper temporarily
sudo spctl --master-disable
```

**"Python not found" error**

```bash
# Install Python 3
brew install python3

# Create symlink (if needed)
sudo ln -s /usr/bin/python3 /usr/local/bin/python
```

#### Windows Issues

**"Python not found" error**

```cmd
# Add Python to PATH
set PATH=%PATH%;C:\Python39\;C:\Python39\Scripts\

# Or use Python launcher
py --version
```

**"Windows Defender blocked this app"**

```powershell
# Add exclusion
Add-MpPreference -ExclusionPath "C:\Program Files\MAC Address Spoofer"

# Or download and verify manually
```

#### Linux Issues

**"Permission denied" error**

```bash
# Fix permissions
sudo chmod +x MAC-Address-Spoofer.AppImage
sudo chmod +x /usr/bin/python3

# Run with sudo if needed
sudo ./MAC-Address-Spoofer.AppImage
```

**"Missing dependencies" error**

```bash
# Install missing packages
# Ubuntu/Debian
sudo apt install libgtk-3-0 libxss1 libasound2-dev

# Fedora
sudo dnf install gtk3 libXScrnSaver alsa-lib

# Arch Linux
sudo pacman -S gtk3 libxss alsa-lib
```

### Verification Steps

#### Verify Installation

1. **Application launches** without errors
2. **Admin privileges** are detected correctly
3. **Network interfaces** appear in the list
4. **MAC generation** works properly
5. **UI elements** are responsive

#### Test Functionality

```bash
# Test Python script directly
python3 src/universal_mac_spoof.py --list

# Test with specific interface
python3 src/universal_mac_spoof.py --info en0

# Generate test MAC
python3 src/universal_mac_spoof.py --generate
```

## 🔄 Updates & Maintenance

### Updating Application

#### Pre-built Binaries

1. Download the latest version
2. Uninstall current version
3. Install new version
4. Configuration will be preserved

#### Source Installation

```bash
# Update repository
git pull origin main

# Update dependencies
npm install

# Rebuild if needed
npm run build:quick
```

### Maintenance Tasks

#### Regular Cleanup

```bash
# Clear application cache
npm run temp-clean

# Reset configuration
rm -rf ~/.config/MAC\ Address\ Spoofer/
```

#### Backup Configuration

```bash
# Backup settings
cp -r ~/.config/MAC\ Address\ Spoofer/ ~/mac-spoofer-backup/

# Backup MAC addresses
cp -r ~/.config/MAC\ Address\ Spoofer/backups/ ~/mac-backups/
```

---

**For more help, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or open an issue on GitHub.**
