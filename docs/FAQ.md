# Frequently Asked Questions

> Common questions and answers about MAC Address Spoofer

## 🚀 General Questions

### What is MAC Address Spoofer?

MAC Address Spoofer is a cross-platform desktop application that allows you to change your network interface's MAC (Media Access Control) address. It provides a modern, dark-themed GUI for secure MAC address spoofing on Windows, macOS, and Linux.

### Is MAC Address Spoofer free?

Yes! MAC Address Spoofer is open-source and released under the MIT license. You can use it, modify it, and distribute it freely.

### What platforms are supported?

- **Windows**: Windows 10 and later (x64)
- **macOS**: macOS 10.15 (Catalina) and later (Intel and Apple Silicon)
- **Linux**: Most modern distributions (Ubuntu, Fedora, Arch, etc.)

### Do I need administrator privileges?

Yes. MAC address spoofing requires administrator/root privileges because it modifies low-level network interface settings. The application will detect if you have sufficient privileges and guide you if not.

## 🔧 Installation & Setup

### How do I install MAC Address Spoofer?

#### Option 1: Download Binaries

1. Go to the [Releases](https://github.com/jasonpaulmichaels/MAC_Spoofer/releases) page
2. Download the appropriate file for your platform:
   - macOS: `.dmg` file (Intel or ARM)
   - Windows: `.exe` installer
   - Linux: `.AppImage` file
3. Run the installer and follow the instructions

#### Option 2: Run from Source

```bash
git clone https://github.com/jasonpaulmichaels/MAC_Spoofer.git
cd mac-spoofer
npm install
npm start
```

### What are the prerequisites?

- **Node.js**: 18.x or later
- **Python**: 3.8 or later
- **Administrator privileges**: Required for MAC operations

### The app won't start. What should I do?

1. **Check Node.js version**: `node --version` (should be 18.x+)
2. **Verify Python installation**: `python3 --version`
3. **Reinstall dependencies**: `npm install`
4. **Run as administrator**: Especially on Windows

## 🌐 Network & MAC Address Questions

### What is a MAC address?

A MAC (Media Access Control) address is a unique identifier assigned to network interfaces. It's used for network communication at the data link layer.

### Why would I want to spoof my MAC address?

Common reasons include:

- **Privacy**: Prevent tracking on public networks
- **Network Testing**: Test network access controls
- **Security Research**: Educational and security testing
- **Bypass Restrictions**: Some networks filter by MAC address

### Is MAC address spoofing legal?

MAC address spoofing is generally legal for legitimate purposes on networks you own or have permission to modify. However:

- Check local laws and regulations
- Only use on networks you own
- Don't use for malicious activities
- Respect network policies and terms of service

### Will changing my MAC address disconnect me from the network?

Yes, temporarily. When you change a MAC address:

1. The network interface briefly disconnects
2. You may need to reconnect to the network
3. Some networks may require reauthentication

### Can I restore my original MAC address?

Yes! The application automatically backs up your original MAC address before spoofing. You can restore it with one click.

### Does MAC spoofing work on all network adapters?

Most modern network adapters support MAC address spoofing, but some may not:

- **Virtual adapters**: Usually don't support spoofing
- **Some USB adapters**: May have locked MAC addresses
- **Corporate-managed adapters**: May be restricted by IT policies

## 🔒 Security & Privacy

### Is MAC Address Spoofer safe to use?

Yes, when used responsibly:

- **Open source**: All code is publicly auditable
- **Secure architecture**: Context isolation and input validation
- **No data collection**: The app doesn't send data anywhere
- **Local operations**: All processing happens on your machine

### Does the app collect my data?

No. MAC Address Spoofer:

- Doesn't connect to the internet
- Doesn't collect personal information
- Doesn't track usage
- Stores all data locally only

### Can my original MAC address be discovered?

After spoofing, your original MAC address is not visible to the network. However:

- It may be stored locally on your device
- Network logs may have recorded it previously
- Some advanced techniques might reveal it

## 🐛 Troubleshooting

### "No Admin Privileges" error

**Solution**: Run the application with elevated privileges:

- **macOS**: Run Terminal with `sudo` first
- **Windows**: Right-click → "Run as administrator"
- **Linux**: Launch from terminal with `sudo`

### Network interfaces not showing

**Solutions**:

1. Click the refresh button
2. Check if network adapters are enabled
3. Test Python script directly: `python3 src/universal_mac_spoof.py --list`
4. Restart the application

### MAC spoofing fails

**Common causes and solutions**:

1. **Insufficient privileges**: Run as administrator
2. **Unsupported adapter**: Try a different network interface
3. **Invalid MAC format**: Use the generate button for valid addresses
4. **Driver issues**: Update network adapter drivers

### Application crashes on startup

**Try these fixes**:

1. **Update graphics drivers**: Especially on Windows
2. **Disable antivirus**: Temporarily exclude the app
3. **Clear cache**: Delete app data and restart
4. **Reinstall**: Fresh installation may fix issues

## 📱 Platform-Specific Questions

### macOS Questions

#### Does it work on Apple Silicon (M1/M2)?

Yes! The application supports both Intel and Apple Silicon Macs with native builds for each architecture.

#### Why do I get a security warning?

macOS Gatekeeper shows a warning for apps from unidentified developers. To fix:

1. Right-click the app → "Open"
2. Or go to System Preferences → Security & Privacy → Allow
3. For permanent solution, use code-signed versions

#### Do I need to disable SIP?

No. System Integrity Protection (SIP) doesn't need to be disabled for MAC address spoofing.

### Windows Questions

#### Do I need PowerShell?

Yes, PowerShell is used for some network operations. It's included with Windows 10+.

#### Why does Windows Defender flag it?

Windows Defender may flag the application because it modifies network settings. This is a false positive:

1. Add the app folder to exclusions
2. Use the code-signed version when available

### Linux Questions

#### Which distributions are supported?

Most modern distributions work:

- Ubuntu 18.04+
- Fedora 30+
- Arch Linux
- Debian 10+
- openSUSE Leap 15.3+

#### Do I need special packages?

Usually not, but some distributions may need:

```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip

# Fedora
sudo dnf install python3 python3-pip

# Arch Linux
sudo pacman -S python python-pip
```

## 🔧 Advanced Usage

### Can I automate MAC spoofing?

Currently, the application doesn't have built-in automation, but you can:

1. Use the Python script directly in your own scripts
2. Use the command-line interface (planned feature)
3. Create custom automation with the API

### How do I generate valid MAC addresses?

The application has a "Generate Random" button that creates:

- **Locally administered addresses** (not assigned to manufacturers)
- **Valid format** (6 pairs of hexadecimal digits)
- **Unicast addresses** (not multicast or broadcast)

### Can I specify a custom MAC address?

Yes! You can enter any valid MAC address:

- Format: `AA:BB:CC:DD:EE:FF` (case insensitive)
- Validation: The app checks format before applying
- Recommendations: Use locally administered addresses

## 📚 Development & Contributing

### How can I contribute?

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Code style and standards
- Pull request process
- Issue reporting
- Development setup

### Can I build from source?

Yes! The application is fully open-source:

```bash
git clone https://github.com/jasonpaulmichaels/MAC_Spoofer.git
cd mac-spoofer
npm install
npm run dev  # Development mode
npm run build:production  # Production build
```

### What's the technology stack?

- **Frontend**: HTML5, CSS3, JavaScript (ES2022)
- **Backend**: Python 3.x
- **Framework**: Electron 39.x
- **Build System**: electron-builder

## 🆘 Support

### Where can I get help?

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: [docs/](./) folder
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Community**: GitHub Discussions

### How do I report a bug?

Please create a GitHub issue with:

1. **Operating system and version**
2. **Application version**
3. **Steps to reproduce**
4. **Expected vs actual behavior**
5. **Error messages** (complete text)
6. **System information** (if relevant)

### Is commercial support available?

Currently, the project is community-supported only. For enterprise features or commercial support, please open an issue to discuss requirements.

---

**Still have questions? Check the [documentation](./DOCUMENTATION_INDEX.md) or open a new issue on GitHub.**
