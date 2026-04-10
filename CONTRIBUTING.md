# Contributing to MAC Address Spoofer

We welcome contributions. This document covers everything you need to get started.

## How to Contribute

1. Fork the repository on GitHub (`sanchez314c/mac-spoofer`)
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the standards below
4. Test on at least one platform before submitting
5. Push and open a Pull Request against `main`

## Development Setup

### Requirements

- Node.js 18+ and npm
- Python 3.8+ (for `src/universal_mac_spoof.py` functionality)
- Administrator/sudo privileges for testing MAC operations
- Platform build tools if compiling: Xcode CLI tools on macOS, Visual Studio Build Tools on Windows

### Setup Steps

```bash
git clone https://github.com/sanchez314c/mac-spoofer.git
cd mac-spoofer
npm install
npm run dev
```

## Code Style and Standards

### JavaScript (ES2022)

- 2-space indentation
- `const`/`let` only, no `var`
- `async/await` over callbacks
- `camelCase` for functions and variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants
- JSDoc comments on all public functions
- Try/catch blocks on all async operations

File naming: `kebab-case.js` (e.g., `auth-handler.js`)

### Python (PEP 8)

- 4-space indentation
- Docstrings on all methods in `MACSpoofer` class
- Type hints where applicable
- Explicit exception handling — no bare `except:` clauses

### CSS

- CSS custom properties from `src/theme.css` design tokens only — no hardcoded hex/rgb values in `src/styles.css`
- BEM class naming
- All interactive elements must have `-webkit-app-region: no-drag` applied

## Architecture Guidelines

Each source file has a distinct, non-overlapping responsibility:

| File | Responsibility |
|------|----------------|
| `src/main.js` | Electron lifecycle, BrowserWindow config, IPC handlers, Python subprocess management |
| `src/preload.js` | contextBridge API surface exposed to renderer — modify carefully |
| `src/app.js` | UI event handling, DOM manipulation, toast notifications |
| `src/auth-handler.js` | Platform-specific privilege escalation (osascript/UAC/pkexec/sudo) |
| `src/universal_mac_spoof.py` | System-level MAC operations for all three platforms |

## Security Requirements

These are non-negotiable:

- **Never disable `contextIsolation`** in `src/main.js` webPreferences
- **Never set `nodeIntegration: true`** in the renderer
- **Never set `experimentalFeatures: true`** — it silently breaks `ipcRenderer.invoke()` on Linux
- **Always validate MAC address format** before passing to the Python script (`/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/`)
- **All IPC channels use `invoke/handle`** — not `send/on`
- **Sanitize interface names** before building subprocess arguments

## Adding a New Feature

### New UI Behavior

1. Add HTML structure to `src/index.html`
2. Add styles to `src/styles.css` using only tokens from `src/theme.css`
3. Add event handlers and DOM logic in `src/app.js`
4. If you need main-process data, add an `ipcMain.handle()` entry in `src/main.js`
5. Expose the new IPC channel through `contextBridge` in `src/preload.js`

### New MAC Operation

1. Add the operation to `src/universal_mac_spoof.py` with argparse support and `--yes` flag compatibility
2. Add an `ipcMain.handle()` in `src/main.js` that calls `executePythonScript()` or `authHandler.executeWithAuth()`
3. Expose via `contextBridge` in `src/preload.js`
4. Add UI flow in `src/app.js`
5. Test on all three platforms

## Testing Requirements

No automated test suite exists yet. Before submitting a PR, manually verify:

- [ ] Application launches without errors on your target platform
- [ ] Network interfaces populate in the sidebar
- [ ] Admin status indicator reflects actual privilege state
- [ ] Random MAC generation produces `02:`, `06:`, `0A:`, or `0E:` first-octet values (locally administered)
- [ ] Custom MAC input validation rejects malformed addresses
- [ ] Spoof operation succeeds with admin rights
- [ ] Restore operation reverts to the pre-spoof MAC
- [ ] Toast notifications render correctly for success/error/warning/info types
- [ ] Window minimize/maximize/close controls work via IPC

## Pull Request Requirements

- Clear description of what changed and why
- Note any platform-specific behavior
- Update `CHANGELOG.md` with the change under `[Unreleased]`
- Update relevant docs files if behavior changes

## Reporting Issues

Include in every bug report:

- OS and version (e.g., Ubuntu 22.04 x64, Windows 11, macOS 14.3 Apple Silicon)
- Node.js version (`node --version`)
- Python version (`python3 --version`)
- Steps to reproduce
- Expected vs actual behavior
- Any error text from the terminal or DevTools console

## Release Process

1. Update version in `package.json`
2. Move `[Unreleased]` section in `CHANGELOG.md` to a dated version entry
3. Run `npm run build:production`
4. Test each generated artifact
5. Git tag: `git tag -a v1.x.x -m "Release v1.x.x"`
6. Create GitHub Release and attach artifacts

## License

By contributing, you agree your work will be licensed under the MIT License.
