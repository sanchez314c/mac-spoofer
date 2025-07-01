# Technology Stack — MAC Address Spoofer

## Runtime Environment

| Component | Version | Role |
|-----------|---------|------|
| Electron | ^39.0.0 | Desktop application framework — main and renderer processes |
| Node.js | 22 (`.nvmrc`) | JavaScript runtime for Electron main process |
| Python 3.x | 3.8+ required | System-level MAC address operations via subprocess |

## Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| electron-store | ^11.0.2 | Persistent settings storage (declared but not yet wired) |
| react | ^19.2.0 | Declared but UI is currently vanilla JS — not yet migrated |
| react-dom | ^19.2.0 | Same — declared for future migration |
| typescript | ^5.9.3 | Declared for future migration — code is currently ES2022 JS |
| vite | ^7.1.12 | Declared for future migration — no vite config present yet |

Note: The active UI stack is **vanilla HTML/CSS/JavaScript (ES2022)** in `src/`. React, TypeScript, and Vite are in `package.json` dependencies in preparation for a planned migration but are not used by the running application.

## Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| electron | ^39.0.0 | Electron framework |
| electron-builder | ^26.0.12 | Multi-platform packaging and distribution |
| eslint | ^9.38.0 | Linting |
| prettier | ^3.6.2 | Code formatting |
| @typescript-eslint/parser | ^8.46.2 | ESLint TypeScript parser (for future TS migration) |
| eslint-plugin-react | ^7.37.5 | React linting rules (for future React migration) |

## Current UI Stack (what actually runs)

- **HTML5** — `src/index.html` single-page app shell
- **CSS3** — `src/theme.css` (design tokens) + `src/styles.css` (components)
- **Vanilla JavaScript ES2022** — `src/app.js` (renderer), `src/main.js` (main), `src/preload.js` (bridge), `src/auth-handler.js` (auth)

Design system: **Neo-Noir Glass Monitor** — floating frameless window with 16px body padding float gap, no `backdrop-filter` dependency on panels, layered multi-shadow depth system, teal (#14b8a6) primary accent.

## Build System

| Tool | Purpose |
|------|---------|
| electron-builder ^26.0.12 | Packages Electron app for all platforms |
| `scripts/compile-build-dist.sh` | Master build orchestrator with testing gates |
| `scripts/bloat-check.sh` | Dependency size analysis |
| `scripts/temp-cleanup.sh` | Build artifact cleanup |

### Build Targets

**macOS**
- Formats: DMG (drag-to-Applications), ZIP, PKG
- Architectures: x64 (Intel), arm64 (Apple Silicon), universal
- App ID: `com.jasonpaulmichaels.macspoofer`

**Windows**
- Formats: NSIS installer, MSI, ZIP, Portable
- Architectures: x64, ia32
- NSIS: user-level install, creates Desktop + Start Menu shortcuts

**Linux**
- Formats: AppImage, DEB, RPM, Snap, tar.xz, tar.gz
- Architectures: x64, arm64, armv7l
- Category: Network;Utility

## Python Backend

`src/universal_mac_spoof.py` uses only the Python standard library:

| Module | Purpose |
|--------|---------|
| `subprocess` | Runs ifconfig, ip, netsh, PowerShell commands |
| `platform` | Detects OS (`platform.system()`) |
| `re` | MAC address validation regex |
| `json` | Writes `mac_spoof_log.json` |
| `argparse` | CLI flag parsing |
| `random` | Random MAC octet generation |
| `datetime` | Log timestamps |

No third-party Python packages required.

## Inter-Process Communication

Electron IPC using the `invoke/handle` pattern (async, returns Promise):

```
Renderer (app.js)
  → window.electronAPI.spoofMac(data)        [src/preload.js contextBridge]
  → ipcRenderer.invoke('spoof-mac', data)    [src/preload.js]
  → ipcMain.handle('spoof-mac', handler)     [src/main.js]
  → authHandler.executeWithAuth(cmd, args)   [src/auth-handler.js]
  → spawn(python, [script, ...args])         [child_process]
```

## Privilege Escalation

| Platform | Tool | Fallback |
|----------|------|---------|
| macOS | `osascript -e 'do shell script ... with administrator privileges'` | None |
| Windows | PowerShell `Start-Process -Verb RunAs -Wait` | Direct execution if already admin |
| Linux | `pkexec` | `gksudo` → `kdesudo` → `sudo -S` |

## Fonts

Loaded from Google Fonts CDN at runtime:
- **Inter** (weights 300, 400, 500, 600, 700) — UI typography
- **JetBrains Mono** (weights 400, 500) — MAC address display, monospace fields

## CI/CD

`.github/workflows/ci.yml` — GitHub Actions:
- Trigger: push/PR to `main` or `master`
- Runner: ubuntu-latest
- Node.js: 18 with npm cache
- Steps: `npm ci` → `npm test`

Note: `npm test` currently echoes "Tests not yet configured" — test implementation is in the roadmap (`docs/TODO.md`).
