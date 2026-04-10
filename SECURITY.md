# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.2.x   | Yes       |
| 1.1.x   | Yes       |
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

Do not open a public GitHub issue for security vulnerabilities.

Report privately via GitHub's Security Advisory feature:
https://github.com/sanchez314c/mac-spoofer/security/advisories/new

Include:
1. A description of the vulnerability and its impact
2. Steps to reproduce
3. Affected version(s)
4. Any suggested fix, if you have one

You should receive an acknowledgment within 48 hours. We aim to release a patch within 7 days for critical issues.

## Security Architecture

### Electron Process Model

The application enforces strict process separation:

```javascript
// src/main.js webPreferences (actual production config)
webPreferences: {
  nodeIntegration: false,      // Node.js not accessible in renderer
  contextIsolation: true,      // Renderer context fully isolated
  preload: path.join(__dirname, 'preload.js'),
  sandbox: false,              // Required for preload script access
  // experimentalFeatures intentionally absent — setting it true
  // silently breaks contextBridge IPC on Linux (Chromium bug)
}
```

All renderer-to-main communication goes through the `contextBridge` API defined in `src/preload.js`. The renderer has no direct access to Node.js, the filesystem, or `ipcRenderer`.

### Privilege Escalation

MAC address changes require root/administrator privileges. `AuthHandler` in `src/auth-handler.js` handles escalation per platform:

| Platform | Mechanism |
|----------|-----------|
| macOS | `osascript -e 'do shell script ... with administrator privileges'` |
| Windows | PowerShell `Start-Process -Verb RunAs -Wait -PassThru` |
| Linux | `pkexec` → `gksudo` → `kdesudo` → `sudo -S` (fallback chain) |

Escalation is triggered only when a spoof or restore operation is initiated — not on startup.

### Input Validation

User-supplied MAC addresses are validated against `/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/` in both the renderer (`src/preload.js` `validateMac`) and the Python backend (`src/universal_mac_spoof.py` `validate_mac`) before any subprocess arguments are constructed.

Interface names come from OS-native enumeration (`ip link show`, `networksetup -listallhardwareports`, `wmic path win32_networkadapter`), limiting injection surface to what the OS itself reports.

### Locally Administered MAC Generation

Random MAC generation in both `src/preload.js` (`generateRandomMac`) and `src/universal_mac_spoof.py` (`generate_safe_mac`) constrains the first octet to `02`, `06`, `0A`, or `0E`, which sets the locally administered bit and prevents generating MACs that collide with real hardware OUIs registered with the IEEE.

### Log File

`src/universal_mac_spoof.py` writes change events to `mac_spoof_log.json` in the working directory. This file records interface names, before/after MAC addresses, timestamps, and the OS platform string. It contains no credentials or authentication tokens.

## Known Limitations

- The Python script falls back to `sudo -S` on Linux as a last resort, which reads a password from stdin. The GUI path uses `pkexec` first.
- On Windows, `Set-NetAdapter -MacAddress` (PowerShell) requires Windows 10+ and a driver that exposes MAC write capability. Not all hardware supports this.
- MAC changes reset on most systems after a reboot. The restore feature relies on `self.original_macs` in the running Python process — this dict does not persist across application restarts.

## Security Considerations for Users

- MAC address spoofing may violate your network's terms of service
- Use only on networks you own or have explicit permission to test
- The application requires administrator/root privileges — review the source before running
- Network logs prior to spoofing may retain your original MAC address
