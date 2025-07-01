# System Architecture — MAC Address Spoofer

MAC Address Spoofer is a frameless Electron desktop application that wraps a Python backend for cross-platform MAC address manipulation.

## Three-Layer Architecture

```
┌──────────────────────────────────────────────────────────────┐
│ Renderer Process (src/index.html + src/app.js)               │
│  MACSpooferUI class: interface selection, spoof/restore UI,  │
│  toast notifications, admin status indicator                 │
└──────────────────────┬───────────────────────────────────────┘
                       │  contextBridge (src/preload.js)
                       │  window.electronAPI.*
                       │  ipcRenderer.invoke() / ipcMain.handle()
┌──────────────────────▼───────────────────────────────────────┐
│ Main Process (src/main.js)                                   │
│  MACSpooferApp class: BrowserWindow, IPC handlers,           │
│  Python subprocess management, output parsing                │
│  AuthHandler (src/auth-handler.js): privilege escalation     │
└──────────────────────┬───────────────────────────────────────┘
                       │  child_process.spawn()
┌──────────────────────▼───────────────────────────────────────┐
│ Python Backend (src/universal_mac_spoof.py)                  │
│  MACSpoofer class: platform detection, interface enumeration,│
│  MAC validation, system command execution, JSON logging      │
└──────────────────────┬───────────────────────────────────────┘
                       │  subprocess calls
              ┌────────┴────────┐
    ┌─────────▼──┐   ┌──────────▼──┐   ┌───────────▼───┐
    │  macOS     │   │  Linux      │   │  Windows      │
    │ ifconfig   │   │ ip link     │   │ PowerShell    │
    │ networksetup│  │ ifconfig    │   │ Set-NetAdapter│
    │ osascript  │   │ pkexec/sudo │   │ RunAs         │
    └────────────┘   └─────────────┘   └───────────────┘
```

## Component Responsibilities

### Renderer Process: `src/app.js`

`MACSpooferUI` class manages all user interaction:

- **`initializeApp()`** — calls `checkAdminPrivileges()`, `loadInterfaces()`, `loadStatus()` in sequence on DOM ready
- **`loadInterfaces()`** — calls `window.electronAPI.getInterfaces()`, renders sidebar list with status badges
- **`selectInterface(name)`** — highlights selection, shows `#macOptions`, populates `#selectedInterface` panel
- **`spoofMacAddress()`** — validates MAC if custom mode, calls `window.electronAPI.spoofMac()`, shows toast, refreshes on success
- **`restoreMacAddress()`** — calls `window.electronAPI.restoreMac()`, refreshes on success
- **`showToast(type, title, message)`** — creates DOM toast elements, auto-removes after 5 seconds
- **`checkAdminPrivileges()`** — updates `#adminStatus` dot and text; shows/hides `#authBtn`

### Preload Script: `src/preload.js`

Exposes exactly 12 methods via `contextBridge.exposeInMainWorld('electronAPI', ...)`:

- 4 async network methods: `getInterfaces`, `getStatus`, `spoofMac`, `restoreMac`
- 2 async auth methods: `checkAdmin`, `testAuthentication`
- 2 async UI methods: `showMessage`, `openExternal`
- 4 async window control methods: `minimizeWindow`, `maximizeWindow`, `closeWindow`, `isMaximized`
- 3 synchronous utility functions (no IPC): `validateMac`, `generateRandomMac`, `normalizeMac`

### Main Process: `src/main.js`

`MACSpooferApp` class:

**Window configuration:** `1100×850` default, `880×620` minimum, `frame: false`, `transparent: true`, `hasShadow: false`, `backgroundColor: '#00000000'`. On Linux only, prepends `--enable-transparent-visuals` and `--disable-gpu-compositing` Chromium flags before `app.ready`.

**Python discovery:** `findPythonCommand()` tries `python3`, `python`, `py` in order by running `--version` and checking exit code.

**Python path:** In packaged builds, `universal_mac_spoof.py` is in `process.resourcesPath/src/` (via `extraResources` in package.json build config). In development, it's at `__dirname/universal_mac_spoof.py`.

**Output parsing:**

- `parseInterfaceOutput(output)` — matches lines like `en0: 18:C0:4D:0E:62:02` using `/^\s*(\w+):\s*([0-9A-Fa-f:]+|N\/A)$/`
- `parseStatusOutput(output)` — state machine over `Interface:`, `Current MAC:`, `Original MAC:`, `Spoofed:` lines

### Authentication: `src/auth-handler.js`

`AuthHandler` class. `executeWithAuth(command, args)` dispatches per `process.platform`:

**Windows (`executeWindows`):** Checks `net session` exit code. If already admin, runs command directly. Otherwise uses PowerShell `Start-Process -FilePath cmd -ArgumentList args -Verb RunAs -Wait -PassThru | ForEach-Object { $_.ExitCode }`.

**macOS (`executeMacOS`):** Builds `do shell script "cmd arg1 arg2" with administrator privileges` and runs via `osascript -e`. Detects `User canceled` in stderr to distinguish cancellation from failure.

**Linux (`executeLinux`):** Tries in order: `pkexec cmd args` → `gksudo cmd args` → `kdesudo cmd args` → `sudo -S cmd args`. Each attempt is wrapped in `tryLinuxAuth()` which resolves with `{ success, output, error, notFound }`. If a tool is not found (ENOENT), it moves to the next fallback.

### Python Backend: `src/universal_mac_spoof.py`

`MACSpoofer` class:

- `generate_safe_mac()` — picks first octet from `['02', '06', '0A', '0E']`, generates 5 random hex octets
- `validate_mac(mac)` — regex `/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/`
- `get_interfaces()` — macOS: parses `networksetup -listallhardwareports` for `Device:` lines; Linux: parses `ip link show` for state lines, excludes `lo`, `docker0`, `veth*`; Windows: parses `wmic path win32_networkadapter get name,netconnectionid`
- `get_current_mac(iface)` — macOS: `ifconfig iface` parse `ether`; Linux: reads `/sys/class/net/{iface}/address`; Windows: `getmac /fo csv /nh`
- `spoof_mac_macos(iface, mac)` — three-step: `sudo ifconfig down` → `sudo ifconfig ether mac` → `sudo ifconfig up`
- `spoof_mac_linux(iface, mac)` — three-step via `ip link` with fallback to `ifconfig hw ether`
- `spoof_mac_windows(iface, mac)` — `powershell Set-NetAdapter -Name iface -MacAddress mac`
- `log_change(iface, original, new)` — appends JSON entry to `mac_spoof_log.json`
- `show_status()` — prints Interface/Current MAC/Original MAC/Spoofed per interface

## UI Layout

```
┌─────────────────────────────── 1100px ──────────────────────────────────┐
│ .title-bar (48px, -webkit-app-region: drag)                             │
│   [logo][app title]              [minimize][maximize][close]            │
│                                  z-index: 50 drag / 200 controls        │
├───────────────────────────────────────────────────────────────────────── │
│ .app-content (flex row)                                                  │
│                                                                          │
│ ┌── .sidebar (220px) ─┐  ┌──────────── .main-content ──────────────┐   │
│ │ INTERFACES header   │  │  .dashboard-grid (CSS grid, 1→2 cols)    │   │
│ │ .interface-list     │  │                                          │   │
│ │   - item (en0)      │  │  ┌── Configuration card ──────────────┐  │   │
│ │   - item (wlan0)    │  │  │  .selected-interface display       │  │   │
│ │     ...             │  │  │  .mac-options:                     │  │   │
│ │                     │  │  │    radio: Random / Custom          │  │   │
│ │ .sidebar-footer     │  │  │    #customMacSection + Generate    │  │   │
│ │   admin status dot  │  │  │    Spoof / Restore buttons         │  │   │
│ │   [Authenticate]    │  │  └────────────────────────────────────┘  │   │
│ └─────────────────────┘  │  ┌── Live Status card ─────────────────┐  │   │
│                          │  │  .status-grid                       │  │   │
│                          │  │    - status-item per interface      │  │   │
│                          │  └────────────────────────────────────┘  │   │
│                          └──────────────────────────────────────────┘   │
│                                                                          │
│ .toast-container (fixed top-right, z-index: 10000)                      │
│ .loading-overlay (fixed, z-index: 500, backdrop-filter: blur 20px)      │
└──────────────────────────────────────────────────────────────────────────┘
```

## Design System

Defined entirely in `src/theme.css` as CSS custom properties. Key tokens:

| Category | Key Tokens |
|----------|-----------|
| Backgrounds | `--bg-void: #0a0b0e`, `--bg-surface: #111214`, `--bg-card: #141518`, `--bg-sidebar: #0d0e10` |
| Accents | `--accent-teal: #14b8a6`, `--accent-blue: #06b6d4`, `--accent-purple: #8b5cf6` |
| Status | `--success: #10b981`, `--warning: #f59e0b`, `--error: #ef4444` |
| Shadows | `--shadow-card` (3 layers), `--shadow-xl` (4 layers), `--shadow-glow` (teal 0.15 alpha) |
| Glass | `--glass-bg: rgba(255,255,255,0.03)`, `--glass-border`, `--glass-highlight` |
| Z-index | `--z-drag-handle: 50`, `--z-window-controls: 200`, `--z-toast: 10000` |
| Typography | `--font-primary: Inter`, `--font-mono: JetBrains Mono` |

The `backdrop-filter` CSS property is intentionally absent on card/panel elements — glass effect is achieved via rgba gradients and multi-layer shadows. This avoids a Chromium rendering bug that prevents transparency in frameless Electron windows on Linux when backdrop-filter is used on non-overlay elements. The loading overlay is the one exception (it CAN use backdrop-filter since it renders over content, not behind it).

## Security Model

| Layer | Mechanism |
|-------|-----------|
| Process isolation | `nodeIntegration: false`, `contextIsolation: true` in webPreferences |
| API surface | Only 12 methods exposed via contextBridge — no raw IPC access |
| Input validation | MAC regex in preload (sync) AND Python validate_mac (before subprocess args) |
| Auth gate | All spoof/restore operations go through `authHandler.executeWithAuth()` |
| No experimentalFeatures | Intentionally absent — would silently break contextBridge invoke() on Linux |

## Data Flow: Spoof Operation

```
User clicks "Spoof MAC Address"
  → app.js spoofMacAddress()
  → validates MAC (if custom mode via validateMac regex)
  → shows loading overlay
  → window.electronAPI.spoofMac({ interface, mac, random })
  → preload.js: ipcRenderer.invoke('spoof-mac', data)
  → main.js ipcMain.handle('spoof-mac'):
      finds python command via findPythonCommand()
      builds args: [script, '-i', iface, '--yes', '-r'|'-m', mac]
      calls authHandler.executeWithAuth(pythonCmd, args)
  → auth-handler.js:
      macOS: osascript → runs python script with elevated shell
      Linux: pkexec → python script
      Windows: PowerShell RunAs → python script
  → universal_mac_spoof.py:
      stores original MAC in self.original_macs[iface]
      calls spoof_mac_{platform}(iface, new_mac)
      calls log_change(iface, original, new)
  → returns { success, output, error } up the chain
  → app.js: hides overlay, shows success/error toast, calls refreshAll()
```
