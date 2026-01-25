# AI Assistant Development Guide

Project-specific instructions for AI assistants working on MAC Address Spoofer.

## Architecture Summary

Three-layer stack. Always understand which layer you are touching before making changes.

```
Renderer (src/app.js + src/index.html)
  — MACSpooferUI class, vanilla ES2022, DOM manipulation
  — communicates only through window.electronAPI (contextBridge)

Main Process (src/main.js)
  — MACSpooferApp class
  — 12 ipcMain.handle() channels
  — spawns Python via child_process.spawn()
  — findPythonCommand() tries: python3, python, py

Auth Layer (src/auth-handler.js)
  — AuthHandler class
  — macOS: osascript "do shell script ... with administrator privileges"
  — Windows: PowerShell Start-Process -Verb RunAs -Wait
  — Linux: pkexec -> gksudo -> kdesudo -> sudo -S (fallback chain)

Python Backend (src/universal_mac_spoof.py)
  — MACSpoofer class, stdlib only
  — platform.system() detection
  — macOS: ifconfig ether; Linux: ip link + ifconfig fallback; Windows: Set-NetAdapter
```

## Critical Constraints

**NEVER add `experimentalFeatures: true` to webPreferences in main.js.**
This silently breaks `ipcRenderer.invoke()` on Linux by preventing the contextBridge from passing Promise results. This was the root cause of the v1.2.2 regression. See CHANGELOG.md v1.2.2.

**NEVER add `nodeIntegration: true` to webPreferences.** Already false, must stay false.

**NEVER disable `contextIsolation`.** Already true, must stay true.

**ALL main-to-renderer communication must go through src/preload.js contextBridge.**
New IPC channels require: `ipcMain.handle()` in main.js + `ipcRenderer.invoke()` in preload.js + exposure via `contextBridge.exposeInMainWorld`.

## Development Commands

```bash
npm start              # run the app (normal mode)
npm run dev            # run with DevTools open
npm run build          # electron-builder current platform
npm run build:mac      # macOS (dmg + zip + pkg, x64 + arm64 + universal)
npm run build:win      # Windows (nsis + msi + zip + portable, x64 + ia32)
npm run build:linux    # Linux (AppImage + deb + rpm + snap + tar, x64 + arm64 + armv7l)
npm run bloat-check    # dependency size analysis
npm run temp-clean     # clean build artifacts
npm run lint           # ESLint
```

Master build orchestrator:
```bash
./scripts/compile-build-dist.sh
./scripts/compile-build-dist.sh --no-clean
```

## File Map

```
src/
├── main.js                 primary: MACSpooferApp class, IPC handlers, BrowserWindow config
├── preload.js              primary: contextBridge API surface (12 IPC + 3 sync utilities)
├── app.js                  primary: MACSpooferUI class, all DOM and user interaction
├── index.html              layout: title bar, 220px sidebar, dashboard grid
├── theme.css               design tokens: 150 CSS custom properties
├── styles.css              component styles: glass cards, shadows, animations
├── auth-handler.js         AuthHandler: platform privilege escalation
└── universal_mac_spoof.py  MACSpoofer: MAC operations, log_change -> mac_spoof_log.json

scripts/
├── compile-build-dist.sh   master build script
├── bloat-check.sh          dependency analysis
├── temp-cleanup.sh         cleanup
└── run-*.sh / run-*.bat    platform-specific run scripts

docs/                       all 15 docs files (see docs/README.md for index)
```

## window.electronAPI Surface

The complete API exposed to the renderer (src/preload.js):

**IPC methods (async, return Promise):**
- `getInterfaces()` — returns `Array<{name, mac}>`
- `getStatus()` — returns `Array<{name, currentMac, originalMac, spoofed}>`
- `spoofMac({interface, mac, random})` — returns `{success, output, error}`
- `restoreMac(interfaceName)` — returns `{success, output, error}`
- `checkAdmin()` — returns `boolean`
- `testAuthentication()` — returns `{success, output, error}`
- `showMessage({type, title, message})` — native dialog
- `openExternal(url)` — system browser
- `minimizeWindow()`, `maximizeWindow()`, `closeWindow()`, `isMaximized()`

**Sync utilities (no IPC, run in preload context):**
- `validateMac(mac)` — regex `/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/` → boolean
- `generateRandomMac()` — first octet from `['02', '06', '0A', '0E']` → string
- `normalizeMac(mac)` — hyphens to colons, uppercase → string

## Python CLI Reference

The app always passes `--yes` to suppress prompts.

```
python3 src/universal_mac_spoof.py [options]

-i IFACE / --interface IFACE   target interface
-m MAC   / --mac MAC           specific MAC to apply
-r       / --random            generate and apply random locally administered MAC
-s       / --status            print current/original/spoofed status per interface
-R IFACE / --restore IFACE     restore original MAC (from in-memory backup)
-l       / --list              list interfaces and current MACs
-y       / --yes               skip interactive confirmations
```

## Design System Rules

The design is Neo-Noir Glass Monitor. When modifying styles:

- All design tokens are in `src/theme.css` as CSS custom properties. Do not hardcode colors.
- Primary accent: `--accent-teal: #14b8a6`
- Background hierarchy: `--bg-void: #0a0b0e` (body) > `--bg-surface: #111214` > `--bg-card: #141518` > `--bg-sidebar: #0d0e10`
- **Do NOT add `backdrop-filter` to card or panel elements.** This breaks window transparency on Linux. The loading overlay (`.loading-overlay`) is the one exception.
- Window: `1100x850` default, `880x620` minimum, `frame: false`, `transparent: true`, `hasShadow: false`
- Title bar: 48px height, `-webkit-app-region: drag` on the bar, `-webkit-app-region: no-drag` on controls

## Linux Transparency Setup

In main.js, before `app.ready`, the following Chromium flags are prepended (Linux only):
```javascript
app.commandLine.appendSwitch('--enable-transparent-visuals');
app.commandLine.appendSwitch('--disable-gpu-compositing');
```
These must remain. Removing them causes the window to render as opaque black on Linux.

## Adding a New IPC Channel

1. Add `ipcMain.handle('channel-name', async (event, args) => {...})` in `src/main.js` `setupIpcHandlers()`
2. Add `channelName: (args) => ipcRenderer.invoke('channel-name', args)` in `src/preload.js` contextBridge object
3. Call `window.electronAPI.channelName(args)` from `src/app.js`
4. Update `docs/API.md` IPC channel reference table

## Packaged Build Path

In packaged builds, `universal_mac_spoof.py` is at:
```javascript
path.join(process.resourcesPath, 'src', 'universal_mac_spoof.py')
```
In development:
```javascript
path.join(__dirname, 'universal_mac_spoof.py')
```
This is handled in `main.js` `findPythonScript()`. Do not hardcode paths.

## Testing Checklist

Before any PR:
- [ ] App launches without console errors
- [ ] Network interfaces populate in sidebar
- [ ] Admin status indicator reflects actual privilege state
- [ ] Random MAC generation produces first octet in `[02, 06, 0A, 0E]`
- [ ] Custom MAC validation rejects malformed input
- [ ] Spoof operation succeeds with admin rights
- [ ] Restore operation reverts to pre-spoof MAC
- [ ] Toast notifications render correctly
- [ ] Window minimize/maximize/close work via title bar controls
- [ ] `python3 src/universal_mac_spoof.py --list` produces correct output on target platform

## Node.js Version

`.nvmrc` specifies Node 24. Run `nvm use` before developing. The CI workflow uses Node 18 (see `.github/workflows/ci.yml` — update this if it causes issues).
