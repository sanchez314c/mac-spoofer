# Deployment Guide

> Complete deployment guide for MAC Address Spoofer

## 🚀 Production Deployment

### Prerequisites

- **Node.js**: 18.x or later
- **Python**: 3.8 or later
- **Build Tools**: Platform-specific development tools
- **Code Signing Certificates**: For distribution (recommended)

### Build Process

#### 1. Environment Setup

```bash
# Clone repository
git clone https://github.com/jasonpaulmichaels/MAC_Spoofer.git
cd mac-spoofer

# Install dependencies
npm install

# Verify environment
npm run deps:check
npm run deps:audit
```

#### 2. Source Testing

```bash
# Mandatory testing before build
./scripts/run-macos-source.sh      # macOS
./scripts/run-windows-source.bat   # Windows
./scripts/run-linux-source.sh      # Linux
```

#### 3. Production Build

```bash
# Full production build
npm run build:production

# Platform-specific builds
npm run build:mac-only        # macOS only
npm run build:win-only        # Windows only
npm run build:linux-only      # Linux only
```

### Platform-Specific Deployment

#### macOS Deployment

```bash
# Build for macOS
npm run build:mac-only

# Generated artifacts
dist/MAC-Address-Spoofer-1.0.0.dmg           # DMG installer
dist/MAC-Address-Spoofer-1.0.0-arm64.dmg     # ARM64 DMG
dist/mac/MAC Address Spoofer.app               # App bundle
dist/mac-arm64/MAC Address Spoofer.app        # ARM64 App bundle
```

**Code Signing (Optional but Recommended)**

```bash
# Sign application
codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name" "dist/mac/MAC Address Spoofer.app"

# Notarize (for distribution)
xcrun altool --notarize-app --primary-bundle-id "com.jasonpaulmichaels.macspoofer" --username "your@email.com" --password "@keychain:AC_PASSWORD" --file "MAC-Address-Spoofer-1.0.0.dmg"
```

#### Windows Deployment

```bash
# Build for Windows
npm run build:win-only

# Generated artifacts
dist/MAC-Address-Spoofer-Setup-1.0.0.exe        # NSIS installer
dist/MAC-Address-Spoofer-1.0.0-win.zip        # Portable ZIP
dist/win-unpacked/MAC Address Spoofer.exe          # Unpacked executable
```

**Code Signing (Optional but Recommended)**

```bash
# Sign executable
signtool sign /f certificate.p12 /p password /t http://timestamp.digicert.com /fd sha256 "dist/win-unpacked/MAC Address Spoofer.exe"

# Sign installer
signtool sign /f certificate.p12 /p password /t http://timestamp.digicert.com /fd sha256 "dist/MAC-Address-Spoofer-Setup-1.0.0.exe"
```

#### Linux Deployment

```bash
# Build for Linux
npm run build:linux-only

# Generated artifacts
dist/MAC-Address-Spoofer-1.0.0.AppImage       # AppImage
dist/linux-unpacked/mac-address-spoofer           # Unpacked binary
```

**Package Creation (Optional)**

```bash
# Create DEB package (Ubuntu/Debian)
electron-installer-debian --src dist/linux-unpacked/ --dest dist/ --arch amd64

# Create RPM package (Fedora/CentOS)
electron-installer-redhat --src dist/linux-unpacked/ --dest dist/ --arch x86_64
```

## 📦 Distribution Channels

### Direct Distribution

- **GitHub Releases**: Primary distribution channel
- **Website Downloads**: Custom landing page
- **Direct Links**: For enterprise distribution

### Package Managers

#### Homebrew (macOS)

```bash
# Create Homebrew formula
brew create --set-name mac-spoofer --set-version 1.0.0 https://github.com/jasonpaulmichaels/MAC_Spoofer/archive/1.0.0.tar.gz

# Install from formula
brew install mac-spoofer
```

#### Chocolatey (Windows)

```bash
# Create Chocolatey package
choco new mac-spoofer

# Install from package
choco install mac-spoofer
```

#### Snap Store (Linux)

```bash
# Create Snap package
snapcraft

# Install from Snap
snap install mac-spoofer
```

## 🔒 Security & Code Signing

### Code Signing Requirements

#### macOS

- **Apple Developer ID**: Required for distribution
- **Notarization**: Required for Gatekeeper compatibility
- **Hardened Runtime**: Enhanced security features

#### Windows

- **Code Signing Certificate**: From trusted CA
- **Authenticode**: For SmartScreen compatibility
- **Timestamp Server**: For signature validation

#### Linux

- **GPG Signing**: Optional for package repositories
- **Repository Keys**: For APT/YUM repositories

### Security Checklist

- [ ] Code signing certificates obtained
- [ ] Build environment is secure
- [ ] Dependencies audited for vulnerabilities
- [ ] Build artifacts verified
- [ ] Notarization completed (macOS)
- [ ] Timestamp server configured (Windows)

## 🌐 Automated Deployment

### GitHub Actions

```yaml
name: Build and Release
on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run build:production

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist/
```

### Continuous Deployment

```bash
# Automated release script
#!/bin/bash
VERSION=$(node -p "require('./package.json').version")
npm run build:production
gh release create "v$VERSION" --generate-notes dist/*
```

## 📊 Deployment Monitoring

### Analytics Integration

```javascript
// Usage analytics (optional)
const analytics = {
  trackEvent: (category, action, label) => {
    // Send to analytics service
  },

  trackPageView: page => {
    // Track documentation views
  },

  trackError: (error, context) => {
    // Track application errors
  },
};
```

### Crash Reporting

```javascript
// Crash reporting setup
const crashReporter = {
  init: () => {
    // Initialize crash reporting
  },

  report: (error, metadata) => {
    // Send crash report
  },
};
```

## 🔧 Configuration Management

### Environment Variables

```bash
# Build configuration
export NODE_ENV=production
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
export CSC_LINK="https://your-certificate-url"
export CSC_KEY_PASSWORD="your-password"
```

### Build Configuration

```json
{
  "build": {
    "publish": [
      {
        "provider": "github",
        "owner": "jasonpaulmichaels",
        "repo": "MAC_Spoofer"
      }
    ],
    "afterSign": "scripts/notarize.js",
    "afterAllArtifactBuild": "scripts/verify-build.js"
  }
}
```

## 🚨 Deployment Troubleshooting

### Common Issues

#### Code Signing Failures

```bash
# Check certificate validity
codesign -dv --verbose=4 "MAC Address Spoofer.app"

# Fix common issues
# 1. Check certificate expiration
# 2. Verify certificate trust chain
# 3. Ensure proper file permissions
```

#### Notarization Failures

```bash
# Check notarization status
xcrun altool --notarization-history --username "your@email.com" --password "@keychain:AC_PASSWORD"

# Common fixes
# 1. Ensure proper bundle ID
# 2. Check entitlements file
# 3. Verify developer account status
```

#### Build Failures

```bash
# Clean build environment
npm run clean:all
rm -rf ~/.cache/electron-builder

# Rebuild with verbose output
DEBUG=electron-builder npm run build:production
```

### Platform-Specific Issues

#### macOS Gatekeeper

```bash
# Check app signature
spctl -a -v "MAC Address Spoofer.app"

# Fix quarantine attribute
xattr -dr com.apple.quarantine "MAC Address Spoofer.app"
```

#### Windows SmartScreen

```bash
# Check signature
signtool verify /pa /v "MAC Address Spoofer.exe"

# Improve reputation
# 1. Submit to Microsoft SmartScreen
# 2. Use EV code signing certificate
# 3. Build user base gradually
```

#### Linux Package Issues

```bash
# Check dependencies
ldd mac-address-spoofer

# Fix library issues
# 1. Bundle required libraries
# 2. Use AppImage for portability
# 3. Specify dependencies in package metadata
```

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] Source code tested on all platforms
- [ ] All dependencies audited
- [ ] Code signing certificates ready
- [ ] Build environment clean
- [ ] Version numbers updated
- [ ] CHANGELOG.md updated

### Build Verification

- [ ] macOS builds and signs correctly
- [ ] Windows builds and signs correctly
- [ ] Linux builds and runs correctly
- [ ] All installers tested
- [ ] File sizes optimized
- [ ] No debug information included

### Post-Deployment

- [ ] Release notes published
- [ ] Download links working
- [ ] Documentation updated
- [ ] Support channels notified
- [ ] Analytics configured
- [ ] Crash reporting tested

---

**For more deployment details, see [BUILD_COMPILE.md](BUILD_COMPILE.md).**
