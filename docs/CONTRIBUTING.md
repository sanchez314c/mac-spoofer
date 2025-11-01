# Contributing to MAC Address Spoofer

Thank you for your interest in contributing to MAC Address Spoofer! We welcome contributions from the community.

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup

### Requirements

- Node.js 16+ and npm
- Python 3.x (for MAC spoofing functionality)
- Administrator/sudo privileges for MAC operations
- Platform-specific build tools (Xcode on macOS, Visual Studio Build Tools on Windows)

### Setup Steps

1. Clone the repository
2. Install dependencies: `npm install`
3. Run in development mode: `npm run dev`
4. Build for production: `npm run dist`

## Code Style & Standards

### File Naming Conventions

- **JavaScript files**: `kebab-case.js` (e.g., `auth-handler.js`)
- **Class names**: `PascalCase` (e.g., `MACSpooferApp`, `AuthHandler`)
- **Function names**: `camelCase` (e.g., `executeWithAuth()`, `checkAdminPrivileges()`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_INTERFACES`, `PYTHON_COMMANDS`)
- **Private methods**: `_leadingUnderscore` (e.g., `_parseInterfaceOutput()`)

### Code Organization

- Use 2 spaces for indentation
- Follow JavaScript and Python best practices
- Add JSDoc comments for public functions
- Test your changes thoroughly
- Maintain security best practices (context isolation, input validation)

### Architecture Guidelines

- **Main Process** (`main.js`): Application lifecycle, window management, IPC
- **Renderer Process** (`app.js`): UI logic, event handling, user feedback
- **Preload Script** (`preload.js`): Secure IPC bridge, API exposure
- **Authentication Handler** (`auth-handler.js`): Cross-platform privilege escalation
- **Python Backend** (`universal_mac_spoof.py`): System-level MAC operations

## Testing Requirements

### Before Submitting

- Test on your target platform
- Verify network interface detection
- Test MAC address validation
- Confirm admin privilege detection
- Test error handling scenarios

### Cross-Platform Testing

- macOS: Test on both Intel and Apple Silicon
- Windows: Test with UAC elevation
- Linux: Test with various privilege escalation methods

## Project Structure

```
MAC_Spoofer/
├── src/                           # Source code directory
│   ├── main.js                   # Main Electron process
│   ├── preload.js                # Secure IPC bridge
│   ├── app.js                    # Frontend application logic
│   ├── auth-handler.js           # Privilege escalation
│   ├── index.html                # Application UI
│   ├── styles.css                # Dark mode styling
│   └── universal_mac_spoof.py    # Python backend
├── scripts/                       # Build and utility scripts
├── build_resources/               # Application assets
├── docs/                         # Documentation
└── dist/                         # Compiled binaries (generated)
```

## Security Considerations

- Never disable context isolation
- Always validate user input
- Use secure IPC communication
- Check admin privileges before operations
- Sanitize interface names
- Don't hardcode credentials

## Build Process

### Development

```bash
npm run dev          # Run with DevTools
npm start            # Run normally
npm run pack         # Test build
```

### Production

```bash
npm run build:quick          # Current platform only
npm run build:production      # All platforms
npm run build:mac-only       # macOS only
npm run build:win-only       # Windows only
npm run build:linux-only     # Linux only
```

## Reporting Issues

When reporting issues, please include:

- Operating system and version
- Steps to reproduce the issue
- Expected vs actual behavior
- Any error messages or logs
- Network interface details (if applicable)

## Pull Request Guidelines

### PR Requirements

- Clear description of changes
- Tests for new functionality
- Documentation updates if needed
- Passes all CI checks
- Follows code style guidelines

### PR Template

- **Problem**: What issue does this solve?
- **Solution**: How did you solve it?
- **Testing**: How did you test it?
- **Breaking Changes**: Any backward-incompatible changes?

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create Git tag
4. Build for all platforms
5. Create GitHub Release
6. Update documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT).
