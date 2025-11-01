# Troubleshooting Guide

> Complete troubleshooting guide for MAC Address Spoofer

## 🚨 Quick Fixes

### Most Common Issues

#### **Application Won't Start**
**Symptoms**: Double-clicking does nothing, error messages on launch

**Solutions**:
1. **Check Dependencies**:
   ```bash
   npm install
   npm start
   ```

2. **Verify Node.js**:
   ```bash
   node --version  # Should be 18.x or later
   ```

3. **Check Python Installation**:
   ```bash
   python3 --version  # Should be 3.x
   which python3      # Verify it's in PATH
   ```

4. **Restart Computer**: Sometimes system resources need refreshing

#### **"No Admin Privileges" Warning**
**Symptoms**: Yellow warning indicator, operations fail

**Solutions**:
- **macOS**: Run Terminal with `sudo` before launching
- **Windows**: Right-click → "Run as administrator"
- **Linux**: Launch from terminal with `sudo`

#### **Network Interfaces Not Showing**
**Symptoms**: Empty interface list, refresh button not working

**Solutions**:
1. **Check Network Adapters**: Ensure adapters are enabled
2. **Refresh Interfaces**: Click refresh button or restart app
3. **Check Python Script**: Test script directly:
   ```bash
   python3 src/universal_mac_spoof.py --list
   ```

#### **MAC Spoofing Fails**
**Symptoms**: Error messages after attempting to change MAC

**Solutions**:
1. **Verify Admin Privileges**: See above
2. **Check Adapter Compatibility**: Some adapters don't support MAC changes
3. **Test Different Interface**: Try another network interface
4. **Restart Network Services**:
   - macOS: `sudo dscacheutil -flushcache`
   - Windows: Restart network adapter in Device Manager
   - Linux: `sudo systemctl restart NetworkManager`

---

## 🔍 Detailed Troubleshooting

### Installation Issues

#### **npm install Fails**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### **Electron Won't Download**
```bash
# Set Electron mirror
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

# Or use cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
```

#### **Python Issues on Windows**
```bash
# Add Python to PATH (PowerShell)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Python39", "User")

# Verify installation
python --version
where python
```

### Runtime Issues

#### **Python Script Not Found**
**Error**: `Error: spawn python3 ENOENT`

**Solutions**:
1. **Verify Python Installation**:
   ```bash
   # macOS/Linux
   which python3

   # Windows
   where python
   where python3
   ```

2. **Update Python Path in main.js**:
   ```javascript
   // Modify this line in src/main.js
   const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
   ```

3. **Install Python**:
   - **macOS**: `brew install python3`
   - **Windows**: Download from python.org
   - **Linux**: `sudo apt install python3 python3-pip`

#### **Permission Denied Errors**
**Error**: Permission denied when running Python script

**macOS Solution**:
```bash
# Check sudo access
sudo -v

# If sudo fails, reset sudo timeout
sudo -k
sudo python3 src/universal_mac_spoof.py --list
```

**Windows Solution**:
```powershell
# Check admin privileges
whoami /priv

# Run PowerShell as Administrator
Start-Process PowerShell -Verb RunAs
```

**Linux Solution**:
```bash
# Check sudo access
sudo whoami

# Fix sudoers file if needed
sudo visudo
# Add: username ALL=(ALL) NOPASSWD: /path/to/python
```

#### **Interface Detection Problems**

**Test Python Script Directly**:
```bash
# List interfaces
python3 src/universal_mac_spoof.py --list

# Check permissions
python3 src/universal_mac_spoof.py --check-permissions

# Test specific interface
python3 src/universal_mac_spoof.py --info en0
```

**Common Interface Names by Platform**:
- **macOS**: `en0`, `en1`, `bridge0`, `utun0`
- **Windows**: `Ethernet`, `Wi-Fi`, `Local Area Connection`
- **Linux**: `eth0`, `wlan0`, `enp3s0`, `wlp2s0`

### Build Issues

#### **electron-builder Fails**
```bash
# Clean build directory
npm run clean

# Clear electron-builder cache
rm -rf ~/.cache/electron-builder

# Rebuild
npm run build:quick
```

#### **Code Signing Errors**
**macOS**:
```bash
# Check certificate
security find-identity -v -p codesigning

# Import certificate if needed
security import certificate.p12 -k ~/Library/Keychains/login.keychain
```

**Windows**:
```bash
# Install certificate to Personal store
certutil -importpfx certificate.p12

# Verify certificate
certmgr.msc
```

#### **Cross-Platform Build Issues**
```bash
# Check system requirements
npm run build:production -- --help

# Build for specific platform only
npm run build:mac-only
npm run build:win-only
npm run build:linux-only
```

### Performance Issues

#### **Slow Startup**
**Solutions**:
1. **Disable Antivirus Scanning**: Exclude app folder from real-time scanning
2. **Check Disk Space**: Ensure adequate free space
3. **Update Graphics Drivers**: Especially on Windows
4. **Disable Unnecessary Startup Programs**

#### **High Memory Usage**
```bash
# Check memory usage
# macOS: Activity Monitor
# Windows: Task Manager
# Linux: htop

# Clear node_modules if bloated
npm run clean:all
npm install
```

#### **Freezing or Crashing**
**Debug Steps**:
1. **Enable Logging**:
   ```javascript
   // Add to main.js
   console.log = require('electron').remote.getGlobal('console').log;
   ```

2. **Check Crash Dumps**:
   - **macOS**: `~/Library/Logs/DiagnosticReports/`
   - **Windows**: `%LOCALAPPDATA%\CrashDumps\`
   - **Linux**: `~/.cache/` or `/var/crash/`

---

## 🛠️ Platform-Specific Issues

### macOS Troubleshooting

#### **Gatekeeper Issues**
```bash
# Allow app from anywhere (temporary)
sudo spctl --master-disable

# Allow specific app
sudo xattr -rd com.apple.quarantine "MAC Address Spoofer.app"

# Re-enable Gatekeeper
sudo spctl --master-enable
```

#### **System Integrity Protection (SIP)**
Some operations may be restricted by SIP. This is normal behavior for security.

#### **Network Interface Names**
Common macOS interface names:
- `en0`: Primary Ethernet/Wi-Fi
- `en1`: Secondary network interface
- `bridge0`: Bridge interfaces
- `utun0`: VPN interfaces
- `anpi0**: Apple Personal Hotspot

#### **Keychain Access**
If prompted for keychain access:
1. Click "Always Allow" for Python
2. Click "Allow" for network interface access

### Windows Troubleshooting

#### **PowerShell Execution Policy**
```powershell
# Check execution policy
Get-ExecutionPolicy

# Set to RemoteSigned if needed
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or bypass for single script
powershell -ExecutionPolicy Bypass -File script.ps1
```

#### **Windows Defender Blocking**
```powershell
# Add exclusion for folder
Add-MpPreference -ExclusionPath "C:\path\to\app"

# Check for threats
Get-MpThreatDetection
```

#### **Network Adapter Drivers**
1. Update network adapter drivers from manufacturer
2. Check Device Manager for adapter issues
3. Reset network settings:
   ```cmd
   netsh winsock reset
   netsh int ip reset
   ipconfig /release
   ipconfig /renew
   ```

#### **Interface Names on Windows**
Common Windows interface names:
- `Ethernet`: Wired connection
- `Wi-Fi`: Wireless connection
- `Local Area Connection`: Legacy name
- `Wireless Network Connection`: Legacy Wi-Fi name

### Linux Troubleshooting

#### **Package Dependencies**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip network-manager

# Fedora
sudo dnf install python3 python3-pip NetworkManager

# Arch Linux
sudo pacman -S python python-pip networkmanager
```

#### **Permission Issues**
```bash
# Add user to network group
sudo usermod -a -G network $USER

# Check sudo access
sudo -l

# Fix Python permissions
sudo chmod +x src/universal_mac_spoof.py
```

#### **Network Manager Issues**
```bash
# Restart NetworkManager
sudo systemctl restart NetworkManager

# Check status
sudo systemctl status NetworkManager

# Check network devices
nmcli device status
```

#### **Interface Names on Linux**
Modern Linux interface naming:
- `enp3s0`: Ethernet (Predictable naming)
- `wlp2s0`: Wireless (Predictable naming)
- `eth0`: Legacy Ethernet
- `wlan0`: Legacy Wireless

---

## 🔧 Advanced Debugging

### Enable Debug Mode
```bash
# Start with DevTools
npm run dev

# Enable verbose logging
DEBUG=1 npm start

# Enable Electron debugging
export ELECTRON_ENABLE_LOGGING=1
npm start
```

### Check Application Logs
```bash
# macOS
~/Library/Logs/MAC Address Spoofer/

# Windows
%APPDATA%\MAC Address Spoofer\logs\

# Linux
~/.config/MAC Address Spoofer/logs/
```

### Test Python Script Independently
```bash
# Test all commands
python3 src/universal_mac_spoof.py --help
python3 src/universal_mac_spoof.py --list
python3 src/universal_mac_spoof.py --check-permissions

# Test with specific interface
python3 src/universal_mac_spoof.py --info en0

# Generate and validate MAC
python3 src/universal_mac_spoof.py --generate
python3 src/universal_mac_spoof.py --validate aa:bb:cc:dd:ee:ff
```

### Network Interface Debugging
```bash
# macOS
ifconfig -a
networksetup -listallhardwareports
ipconfig getifaddr en0

# Windows
netsh interface show interface
ipconfig /all
Get-NetAdapter (PowerShell)

# Linux
ip addr show
ip link show
nmcli device show
```

---

## 📞 Getting Help

### Collect Diagnostic Information
Create a support ticket with this information:

1. **System Information**:
   ```bash
   npm run get-system-info
   ```

2. **Application Logs**:
   - Location varies by platform (see above)
   - Include last 50 lines of logs

3. **Error Screenshots**:
   - Full screenshots of error messages
   - Include system UI elements

4. **Steps to Reproduce**:
   - Detailed steps you took
   - Expected vs actual behavior

### Support Channels
- **GitHub Issues**: Report bugs and feature requests
- **Discord Community**: Real-time chat support
- **Email Support**: support@jasonpaulmichaels.com

### What to Include in Bug Reports
1. **Operating System**: Version and architecture
2. **App Version**: From Help → About menu
3. **Python Version**: `python3 --version`
4. **Node.js Version**: `node --version`
5. **Error Messages**: Complete error text
6. **Steps to Reproduce**: Detailed reproduction steps
7. **Expected Behavior**: What should have happened
8. **Actual Behavior**: What actually happened

---

## 🎯 Quick Reference

### Essential Commands
```bash
# Development
npm run dev                    # Start with DevTools
npm start                      # Normal start

# Dependencies
npm install                    # Install dependencies
npm run clean                  # Clean build artifacts
npm run deps:audit            # Security check

# Python Script Testing
python3 src/universal_mac_spoof.py --list
python3 src/universal_mac_spoof.py --check-permissions
```

### Common File Locations
- **macOS**: `/Applications/MAC Address Spoofer.app`
- **Windows**: `C:\Program Files\MAC Address Spoofer\`
- **Linux**: `/opt/MAC Address Spoofer/` or `~/.local/share/MAC Address Spoofer/`

### Error Message Meanings
- **Permission Denied**: Need admin/sudo privileges
- **Interface Not Found**: Interface name is incorrect
- **Invalid MAC Address**: MAC format is wrong
- **Python Error**: Python installation issue

---

**Still having issues? Check the [GitHub Issues](https://github.com/jasonpaulmichaels/MAC_Spoofer/issues) or create a new issue with detailed information.**