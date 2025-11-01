# Quick Start Guide

> Get MAC Address Spoofer running in minutes

## 🚀 Quick Start (5 Minutes)

### Step 1: Download & Install

#### Option A: Pre-built Binary (Fastest)

1. **Download** for your platform:
   - [macOS Intel](https://github.com/jasonpaulmichaels/MAC_Spoofer/releases/download/v1.0.0/MAC-Address-Spoofer-1.0.0.dmg)
   - [macOS Apple Silicon](https://github.com/jasonpaulmichaels/MAC_Spoofer/releases/download/v1.0.0/MAC-Address-Spoofer-1.0.0-arm64.dmg)
   - [Windows](https://github.com/jasonpaulmichaels/MAC_Spoofer/releases/download/v1.0.0/MAC-Address-Spoofer-Setup-1.0.0.exe)
   - [Linux](https://github.com/jasonpaulmichaels/MAC_Spoofer/releases/download/v1.0.0/MAC-Address-Spoofer-1.0.0.AppImage)

2. **Install**:
   - **macOS**: Open DMG, drag to Applications
   - **Windows**: Run installer as Administrator
   - **Linux**: Make AppImage executable, run it

#### Option B: Run from Source

```bash
git clone https://github.com/jasonpaulmichaels/MAC_Spoofer.git
cd mac-spoofer
npm install
npm start
```

### Step 2: Launch with Privileges

#### macOS

```bash
# Method 1: From Terminal
sudo open -a "MAC Address Spoofer"

# Method 2: From Finder
# Right-click app → Open → Enter password
```

#### Windows

```bash
# Right-click → "Run as administrator"
```

#### Linux

```bash
sudo ./MAC-Address-Spoofer.AppImage
```

### Step 3: Basic Usage

#### 1. Check Admin Status

- Look for **green indicator** in header
- **Yellow** means you need more privileges
- Restart app with proper privileges if needed

#### 2. Select Network Interface

- Browse the list of detected interfaces
- Click on your target interface (e.g., "Wi-Fi", "Ethernet")
- Interface details will appear in status panel

#### 3. Generate or Enter MAC Address

- **Option A**: Click "Generate Random" for a valid MAC
- **Option B**: Enter custom MAC in format `AA:BB:CC:DD:EE:FF`
- App validates format automatically

#### 4. Spoof MAC Address

- Click "Spoof MAC Address" button
- Confirm if prompted
- Wait for operation to complete
- Success/error message will appear

#### 5. Verify Change

- Check status panel for new MAC address
- Original MAC is automatically backed up
- Click "Restore Original" to revert anytime

## 🎯 Common Use Cases

### Privacy Protection

```bash
# Quick privacy setup
1. Launch app with admin privileges
2. Select Wi-Fi interface
3. Click "Generate Random"
4. Click "Spoof MAC Address"
5. Reconnect to network
```

### Network Testing

```bash
# Test network access controls
1. Note current MAC address
2. Generate random MAC
3. Apply new MAC
4. Test network access
5. Document results
```

### Regular Rotation

```bash
# Periodic MAC changes
1. Generate new MAC address
2. Apply to interface
3. Save MAC to notes (optional)
4. Repeat as needed
```

## ⚡ Pro Tips

### Faster Workflow

- **Keyboard shortcuts**: Use Tab to navigate fields
- **Quick refresh**: Click refresh button if interfaces don't appear
- **Batch operations**: Use Python script directly for automation

### Best Practices

- **Test first**: Try on non-critical interfaces
- **Keep notes**: Save original MACs separately
- **Network restart**: May need to reconnect after spoofing
- **Valid formats**: Use app's generate button for valid MACs

### Troubleshooting Quick Fixes

#### "No Admin Privileges"

```bash
# macOS
sudo -v  # Check sudo access
sudo open -a "MAC Address Spoofer"

# Windows
# Right-click → Run as administrator

# Linux
sudo whoami  # Check sudo access
sudo ./app
```

#### "Interface Not Found"

- Click refresh button
- Check if adapter is enabled
- Try different interface name

#### "Invalid MAC Address"

- Use "Generate Random" button
- Format: `AA:BB:CC:DD:EE:FF`
- Use colons, not hyphens

## 🔧 Advanced Quick Start

### Command Line Interface

```bash
# Direct Python script usage
python3 src/universal_mac_spoof.py --list                    # List interfaces
python3 src/universal_mac_spoof.py --spoof en0 AA:BB:CC:DD:EE:FF  # Change MAC
python3 src/universal_mac_spoof.py --restore en0               # Restore original
python3 src/universal_mac_spoof.py --generate                  # Generate MAC
```

### Automation Script

```bash
#!/bin/bash
# Simple automation script
INTERFACE="en0"
NEW_MAC=$(python3 src/universal_mac_spoof.py --generate)
echo "Changing $INTERFACE to $NEW_MAC"
python3 src/universal_mac_spoof.py --spoof $INTERFACE $NEW_MAC
```

## 📱 Platform-Specific Notes

### macOS

- **Interface names**: `en0` (Wi-Fi), `en1` (Ethernet)
- **Keychain access**: Click "Always Allow" when prompted
- **SIP**: Don't need to disable System Integrity Protection

### Windows

- **Interface names**: `Wi-Fi`, `Ethernet`
- **PowerShell**: Used for some operations
- **Defender**: May need to add exclusion

### Linux

- **Interface names**: `wlan0` (Wi-Fi), `eth0` (Ethernet)
- **Modern names**: `wlp2s0`, `enp3s0` on newer systems
- **Dependencies**: Usually included in modern distributions

## 🎉 Success Checklist

You're successfully running MAC Address Spoofer when:

- [ ] Application launches without errors
- [ ] Admin status shows green
- [ ] Network interfaces are listed
- [ ] MAC address generation works
- [ ] Spoofing completes successfully
- [ ] Network connection works with new MAC
- [ ] Original MAC can be restored

## 🆘 Need Help?

### Quick Resources

- **[Full Documentation](./DOCUMENTATION_INDEX.md)**
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)**
- **[GitHub Issues](https://github.com/jasonpaulmichaels/MAC_Spoofer/issues)**

### Common Questions

- **Q: Does this work on VPN?** A: Yes, but spoof before connecting
- **Q: Will this break my network?** A: Temporarily, may need to reconnect
- **Q: Is this permanent?** A: No, restore anytime with one click
- **Q: Can I use any MAC?** A: Any valid format, use locally administered for privacy

---

**Ready to start? [Download now](https://github.com/jasonpaulmichaels/MAC_Spoofer/releases) or [build from source](../INSTALLATION.md)!**
