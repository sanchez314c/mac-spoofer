# Installation Guide

Complete installation instructions for MAC Address Spoofer v1.2.2.

## Option 1: Pre-built Binaries

Download from [GitHub Releases](https://github.com/sanchez314c/mac-spoofer/releases).

### macOS

1. Download the appropriate DMG:
   - Intel: `MAC-Address-Spoofer-1.2.2.dmg`
   - Apple Silicon: `MAC-Address-Spoofer-1.2.2-arm64.dmg`
   - Universal (both): `MAC-Address-Spoofer-1.2.2-universal.dmg`

2. Open the DMG and drag to Applications.

3. On first launch, macOS Gatekeeper may block the app if it is not notarized. Right-click the app and choose "Open" to bypass the warning, or remove the quarantine attribute:
   ```bash
   sudo xattr -rd com.apple.quarantine "/Applications/MAC Address Spoofer.app"
   ```

### Windows

1. Download `MAC-Address-Spoofer-Setup-1.2.2.exe` (NSIS installer).
2. Right-click the installer and choose "Run as administrator".
3. Follow the wizard. The installer creates Desktop and Start Menu shortcuts.

For a portable version with no installer, download `MAC-Address-Spoofer-1.2.2-win.zip`.

### Linux

1. Download `MAC-Address-Spoofer-1.2.2.AppImage`.
2. Make it executable and run:
   ```bash
   chmod +x MAC-Address-Spoofer-1.2.2.AppImage
   ./MAC-Address-Spoofer-1.2.2.AppImage
   ```

For DEB, RPM, or Snap packages, check the releases page for your architecture.

**Linux transparency note:** The app sets `--enable-transparent-visuals` and `--disable-gpu-compositing` automatically. If the window appears opaque, your compositor may not support ARGB visuals. Compositors known to work: Picom, Compton, KWin (KDE), Mutter (GNOME 45+).

## Option 2: Build from Source

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 22.x | See `.nvmrc`. Use `nvm use` if you have nvm. |
| Python | 3.8+ | Standard library only, no pip packages needed |
| npm | 9.x+ | Comes with Node.js |
| Git | any | |

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/sanchez314c/mac-spoofer.git
cd mac-spoofer

# 2. Install Node dependencies
npm install

# 3. Run the application
npm start
```

To run with DevTools open:
```bash
npm run dev
```

### Verify Python works

Before running the app, confirm the Python backend works on your system:

```bash
python3 src/universal_mac_spoof.py --list
```

You should see a list of your network interfaces and their current MACs. If this fails, the app will fail the same way.

## System Requirements

### macOS
- macOS 10.15 (Catalina) or later
- Intel x64 or Apple Silicon (arm64)
- Python 3.8+ accessible as `python3`
- Administrator password for MAC operations (osascript prompt)

### Windows
- Windows 10 (1903) or later, x64 or ia32
- Python 3.8+ on system PATH (accessible as `python` or `py`)
- Administrator account for MAC operations (UAC prompt)
- PowerShell (included with Windows 10+)

### Linux
- Modern distribution: Ubuntu 18.04+, Fedora 30+, Arch, Debian 10+
- x64, arm64, or armv7l
- Python 3.8+ as `python3`
- `pkexec` (recommended), `gksudo`, `kdesudo`, or `sudo` for privilege escalation
- `ip` command (`iproute2` package) — fallback to `ifconfig` if not present
- Working compositor for window transparency (optional, affects appearance only)

### Python Installation

**macOS (Homebrew):**
```bash
brew install python3
python3 --version
```

**Windows:**
Download from [python.org](https://www.python.org/downloads/). Check "Add Python to PATH" during install.
```cmd
python --version
where python
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3
python3 --version
```

**Fedora:**
```bash
sudo dnf install python3
```

**Arch:**
```bash
sudo pacman -S python
```

## First Run

1. Launch the application.
2. The sidebar lists your network interfaces with their current MAC addresses.
3. Check the admin status indicator in the sidebar footer:
   - Green dot: admin privileges are available
   - Orange/red dot: click "Authenticate" to go through the privilege escalation flow
4. Select an interface, choose Random or Custom MAC mode, click "Spoof MAC Address".
5. The Spoof operation triggers a platform privilege prompt (osascript on macOS, UAC on Windows, pkexec/sudo on Linux).

## Updating

For binary installs: download the new version and install over the old one.

For source installs:
```bash
git pull origin main
npm install
```

## Uninstall

**macOS:** Drag `MAC Address Spoofer.app` from Applications to Trash.

**Windows:** Use Add/Remove Programs (NSIS installer adds an uninstaller). For portable, just delete the folder.

**Linux AppImage:** Delete the `.AppImage` file.

**Source:** Delete the cloned directory. No system-level files are installed.

Note: `mac_spoof_log.json` (created in the working directory when a spoof succeeds) is not removed by uninstalling. Delete it manually if you want to remove the operation log.
