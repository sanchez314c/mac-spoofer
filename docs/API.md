# API Reference — MAC Address Spoofer

This document describes the actual `window.electronAPI` surface exposed by `src/preload.js` via `contextBridge`, and the CLI interface of `src/universal_mac_spoof.py`.

## `window.electronAPI` (Renderer API)

All methods return Promises. They are exposed via `contextBridge.exposeInMainWorld('electronAPI', ...)` in `src/preload.js`.

### Interface Operations

#### `getInterfaces()`

Lists all network interfaces with their current MAC addresses.

```javascript
const interfaces = await window.electronAPI.getInterfaces();
// Returns: Array<{ name: string, mac: string | null }>
// Example: [{ name: 'en0', mac: '18:C0:4D:0E:62:02' }, { name: 'eth0', mac: null }]
```

Calls IPC channel `get-interfaces` → `main.js` runs `python3 universal_mac_spoof.py --list` and parses the output with `parseInterfaceOutput()`.

#### `getStatus()`

Returns the spoof state of all interfaces.

```javascript
const status = await window.electronAPI.getStatus();
// Returns: Array<{
//   name: string,
//   currentMac: string | null,
//   originalMac: string | null,
//   spoofed: boolean
// }>
```

Calls IPC channel `get-status` → runs `universal_mac_spoof.py --status` and parses with `parseStatusOutput()`.

### MAC Operations

#### `spoofMac(data)`

Changes the MAC address of a network interface. Requires admin privileges — triggers the platform privilege escalation flow.

```javascript
const result = await window.electronAPI.spoofMac({
  interface: 'en0',     // interface name string
  mac: '02:AB:CD:EF:12:34',  // specific MAC, or null if random
  random: false          // if true, Python generates a safe MAC
});
// Returns: { success: boolean, output: string, error: string }
```

Calls IPC channel `spoof-mac` → `main.js` calls `authHandler.executeWithAuth(pythonCmd, [script, '-i', iface, '--yes', '-r'|'-m', mac])`.

#### `restoreMac(interfaceName)`

Restores the original MAC address for an interface. Requires admin privileges.

```javascript
const result = await window.electronAPI.restoreMac('en0');
// Returns: { success: boolean, output: string, error: string }
```

Calls IPC channel `restore-mac` → runs `universal_mac_spoof.py --restore <iface> --yes`.

### Authentication and Privileges

#### `checkAdmin()`

Checks whether the process currently has admin/root privileges.

```javascript
const hasAdmin = await window.electronAPI.checkAdmin();
// Returns: boolean
```

Platform checks:
- **Windows**: `net session` (exit code 0 = admin)
- **macOS/Linux**: `sudo -n true` (exit code 0 = cached sudo token active)

#### `testAuthentication()`

Runs a test command through the privilege escalation path to verify credentials.

```javascript
const result = await window.electronAPI.testAuthentication();
// Returns: { success: boolean, output: string, error: string }
```

On Windows runs `net session`; on macOS/Linux runs `echo test` through the auth chain.

### Window Controls

All four use the `invoke/handle` IPC pattern — not `send/on`.

```javascript
window.electronAPI.minimizeWindow()   // IPC: 'minimize-window'
window.electronAPI.maximizeWindow()   // IPC: 'maximize-window' (toggles)
window.electronAPI.closeWindow()      // IPC: 'close-window'
window.electronAPI.isMaximized()      // IPC: 'window-is-maximized' → boolean
```

### UI Operations

#### `showMessage(options)`

Shows a native dialog box.

```javascript
await window.electronAPI.showMessage({
  type: 'info',       // 'info' | 'warning' | 'error' | 'question'
  title: 'About',
  message: 'MAC Address Spoofer v1.0.0'
});
```

#### `openExternal(url)`

Opens a URL in the system default browser.

```javascript
await window.electronAPI.openExternal('https://github.com/sanchez314c/mac-spoofer');
```

### Utility Functions (synchronous, no IPC)

These run entirely in the preload context — no main process round-trip.

#### `validateMac(mac)`

```javascript
window.electronAPI.validateMac('02:AB:CD:EF:12:34') // → true
window.electronAPI.validateMac('invalid')             // → false
```

Pattern: `/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/`

#### `generateRandomMac()`

Generates a locally administered unicast MAC address.

```javascript
window.electronAPI.generateRandomMac() // → e.g. '0A:3F:7C:12:E4:91'
```

First octet constrained to `02`, `06`, `0A`, or `0E` (locally administered bit set, broadcast bit clear). Remaining 5 octets are random.

#### `normalizeMac(mac)`

Converts hyphens to colons and uppercases.

```javascript
window.electronAPI.normalizeMac('02-ab-cd-ef-12-34') // → '02:AB:CD:EF:12:34'
```

---

## Python Script CLI (`src/universal_mac_spoof.py`)

The script can be run directly for automation or testing. The Electron app always passes `--yes` to suppress interactive prompts.

```
python3 src/universal_mac_spoof.py [options]
```

| Flag | Description |
|------|-------------|
| `-i IFACE`, `--interface IFACE` | Target interface name |
| `-m MAC`, `--mac MAC` | Specific MAC to apply |
| `-r`, `--random` | Generate and apply a random locally administered MAC |
| `-s`, `--status` | Print current/original MAC and spoofed status for all interfaces |
| `-R IFACE`, `--restore IFACE` | Restore original MAC for IFACE (from in-memory backup) |
| `-l`, `--list` | List interfaces and current MACs |
| `-y`, `--yes` | Skip all interactive confirmations (required for GUI mode) |

### Output format for `--list`

```
Available network interfaces:
  en0: 18:C0:4D:0E:62:02
  en1: N/A
```

Parsed by `main.js` `parseInterfaceOutput()`: lines matching `^\s*(\w+):\s*([0-9A-Fa-f:]+|N\/A)$`.

### Output format for `--status`

```
Interface: en0
  Current MAC: 02:AB:CD:EF:12:34
  Original MAC: 18:C0:4D:0E:62:02
  Spoofed: Yes

Interface: en1
  Current MAC: N/A
  Original MAC: Unknown
  Spoofed: No
```

Parsed by `main.js` `parseStatusOutput()`.

### Platform behavior

| Platform | Spoof command |
|----------|--------------|
| macOS | `sudo ifconfig <iface> down` → `sudo ifconfig <iface> ether <mac>` → `sudo ifconfig <iface> up` |
| Linux | `sudo ip link set dev <iface> down` → `sudo ip link set dev <iface> address <mac>` → `sudo ip link set dev <iface> up` (falls back to `ifconfig hw ether` if `ip` fails) |
| Windows | `powershell Set-NetAdapter -Name "<iface>" -MacAddress "<mac>"` |

### Log file

Every successful spoof is appended to `mac_spoof_log.json` in the working directory:

```json
[
  {
    "timestamp": "2026-02-08T19:18:00.000000",
    "interface": "en0",
    "original_mac": "18:C0:4D:0E:62:02",
    "new_mac": "02:AB:CD:EF:12:34",
    "system": "darwin"
  }
]
```

---

## IPC Channel Reference

All channels use `ipcMain.handle` / `ipcRenderer.invoke`.

| Channel | Direction | Handler Location | Purpose |
|---------|-----------|-----------------|---------|
| `get-interfaces` | renderer → main | `main.js` setupIpcHandlers | Run `--list`, parse output |
| `get-status` | renderer → main | `main.js` setupIpcHandlers | Run `--status`, parse output |
| `spoof-mac` | renderer → main | `main.js` setupIpcHandlers | Run spoof via authHandler |
| `restore-mac` | renderer → main | `main.js` setupIpcHandlers | Run restore via authHandler |
| `check-admin` | renderer → main | `main.js` setupIpcHandlers | Delegate to authHandler.checkAdminPrivileges() |
| `test-authentication` | renderer → main | `main.js` setupIpcHandlers | Run test command via authHandler |
| `show-message` | renderer → main | `main.js` setupIpcHandlers | dialog.showMessageBox() |
| `open-external` | renderer → main | `main.js` setupIpcHandlers | shell.openExternal() |
| `minimize-window` | renderer → main | `main.js` setupIpcHandlers | mainWindow.minimize() |
| `maximize-window` | renderer → main | `main.js` setupIpcHandlers | toggle maximize/unmaximize |
| `close-window` | renderer → main | `main.js` setupIpcHandlers | mainWindow.close() |
| `window-is-maximized` | renderer → main | `main.js` setupIpcHandlers | mainWindow.isMaximized() |
