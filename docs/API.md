# API Reference

> Complete API documentation for MAC Address Spoofer

## 🔌 IPC API Reference

### Main Process → Renderer Process APIs

#### Network Interface APIs

##### `getNetworkInterfaces()`
Returns a list of all available network interfaces with their current MAC addresses.

**Returns:**
```javascript
Promise<Array<{
  name: string,           // Interface name (e.g., "en0", "Ethernet")
  displayName: string,    // User-friendly name
  currentMac: string,     // Current MAC address
  originalMac: string,    // Original MAC address (if backed up)
  status: 'active' | 'inactive' | 'unknown',
  isSpoofed: boolean,     // True if MAC is currently spoofed
  type: 'wired' | 'wireless' | 'virtual'
}>>
```

**Example:**
```javascript
const interfaces = await window.api.getNetworkInterfaces();
console.log(interfaces);
// [
//   {
//     name: "en0",
//     displayName: "Wi-Fi",
//     currentMac: "aa:bb:cc:dd:ee:ff",
//     originalMac: "11:22:33:44:55:66",
//     status: "active",
//     isSpoofed: true,
//     type: "wireless"
//   }
// ]
```

##### `refreshInterfaces()`
Forces a refresh of the network interface list.

**Returns:**
```javascript
Promise<boolean>  // true if refresh was successful
```

**Example:**
```javascript
const success = await window.api.refreshInterfaces();
if (success) {
  const interfaces = await window.api.getNetworkInterfaces();
}
```

#### MAC Address Operations

##### `generateRandomMac()`
Generates a random, valid MAC address.

**Returns:**
```javascript
Promise<string>  // Random MAC address in format "aa:bb:cc:dd:ee:ff"
```

**Example:**
```javascript
const randomMac = await window.api.generateRandomMac();
console.log(randomMac); // "1a:2b:3c:4d:5e:6f"
```

##### `validateMacAddress(macAddress: string)`
Validates if a MAC address is in the correct format.

**Parameters:**
- `macAddress` (string): MAC address to validate

**Returns:**
```javascript
Promise<{
  valid: boolean,
  error?: string  // Error message if invalid
}>
```

**Example:**
```javascript
const result = await window.api.validateMacAddress("aa:bb:cc:dd:ee:ff");
console.log(result); // { valid: true }

const invalid = await window.api.validateMacAddress("invalid");
console.log(invalid); // { valid: false, error: "Invalid MAC address format" }
```

##### `spoofMacAddress(interfaceName: string, newMacAddress: string)`
Attempts to change the MAC address of a network interface.

**Parameters:**
- `interfaceName` (string): Name of the network interface
- `newMacAddress` (string): New MAC address to apply

**Returns:**
```javascript
Promise<{
  success: boolean,
  message: string,       // Success or error message
  originalMac?: string,  // Original MAC (if successful)
  currentMac?: string    // New MAC (if successful)
}>
```

**Example:**
```javascript
const result = await window.api.spoofMacAddress("en0", "aa:bb:cc:dd:ee:ff");
if (result.success) {
  console.log(`MAC changed from ${result.originalMac} to ${result.currentMac}`);
} else {
  console.error(`Failed: ${result.message}`);
}
```

##### `restoreOriginalMac(interfaceName: string)`
Restores the original MAC address for an interface.

**Parameters:**
- `interfaceName` (string): Name of the network interface

**Returns:**
```javascript
Promise<{
  success: boolean,
  message: string,
  restoredMac?: string
}>
```

**Example:**
```javascript
const result = await window.api.restoreOriginalMac("en0");
if (result.success) {
  console.log(`Restored MAC: ${result.restoredMac}`);
}
```

#### System & Privilege APIs

##### `checkAdminPrivileges()`
Checks if the application has administrator/root privileges.

**Returns:**
```javascript
Promise<{
  hasAdmin: boolean,
  platform: 'windows' | 'macos' | 'linux',
  message: string
}>
```

**Example:**
```javascript
const admin = await window.api.checkAdminPrivileges();
if (admin.hasAdmin) {
  console.log("Running with administrator privileges");
} else {
  console.log(`Admin privileges needed: ${admin.message}`);
}
```

##### `getSystemInfo()`
Returns system information useful for debugging.

**Returns:**
```javascript
Promise<{
  platform: string,
  arch: string,
  nodeVersion: string,
  electronVersion: string,
  pythonVersion?: string,
  supportedFeatures: string[]
}>
```

**Example:**
```javascript
const info = await window.api.getSystemInfo();
console.log(`Running on ${info.platform} ${info.arch}`);
console.log(`Electron ${info.electronVersion}, Node ${info.nodeVersion}`);
```

#### Utility APIs

##### `showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info')`
Displays a toast notification.

**Parameters:**
- `message` (string): Notification message
- `type` (string): Notification type

**Returns:**
```javascript
Promise<void>
```

**Example:**
```javascript
await window.api.showNotification("MAC address changed successfully!", "success");
await window.api.showNotification("Administrator privileges required", "warning");
```

##### `openExternal(url: string)`
Opens a URL in the system's default browser.

**Parameters:**
- `url` (string): URL to open

**Returns:**
```javascript
Promise<void>
```

**Example:**
```javascript
await window.api.openExternal("https://github.com/jasonpaulmichaels/MAC_Spoofer");
```

##### `showMessageBox(options: object)`
Shows a native message box.

**Parameters:**
- `options` (object): Message box options
  - `type` (string): 'info', 'warning', 'error', 'question'
  - `title` (string): Window title
  - `message` (string): Main message
  - `detail` (string, optional): Additional details
  - `buttons` (string[]): Button labels
  - `defaultId` (number): Default button index

**Returns:**
```javascript
Promise<{
  response: number,  // Index of clicked button
  checkboxChecked?: boolean
}>
```

**Example:**
```javascript
const result = await window.api.showMessageBox({
  type: 'question',
  title: 'Confirm MAC Change',
  message: 'Are you sure you want to change this MAC address?',
  buttons: ['Yes', 'No'],
  defaultId: 1
});

if (result.response === 0) {
  // User clicked "Yes"
  await performMacChange();
}
```

## 🐍 Python Script API

The Python script (`src/universal_mac_spoof.py`) can be called directly with the following command-line arguments:

### Command Line Arguments

#### `--list`
Lists all available network interfaces.

```bash
python3 src/universal_mac_spoof.py --list
```

**Output Format:**
```
INTERFACE_NAME|CURRENT_MAC|STATUS|TYPE
en0|aa:bb:cc:dd:ee:ff|active|wireless
en1|11:22:33:44:55:66|inactive|wired
```

#### `--spoof <interface> <mac_address>`
Spoofs the MAC address of a specified interface.

```bash
python3 src/universal_mac_spoof.py --spoof en0 aa:bb:cc:dd:ee:ff
```

**Return Codes:**
- `0`: Success
- `1`: Permission denied
- `2`: Interface not found
- `3`: Invalid MAC address
- `4`: Operation failed

#### `--restore <interface>`
Restores the original MAC address for an interface.

```bash
python3 src/universal_mac_spoof.py --restore en0
```

**Return Codes:**
- `0`: Success
- `1`: Permission denied
- `2`: Interface not found
- `3`: No backup found
- `4`: Operation failed

#### `--generate`
Generates a random MAC address.

```bash
python3 src/universal_mac_spoof.py --generate
```

**Output:**
```
aa:bb:cc:dd:ee:ff
```

#### `--validate <mac_address>`
Validates a MAC address format.

```bash
python3 src/universal_mac_spoof.py --validate aa:bb:cc:dd:ee:ff
```

**Return Codes:**
- `0`: Valid
- `1`: Invalid format

#### `--check-permissions`
Checks if the script has the necessary permissions.

```bash
python3 src/universal_mac_spoof.py --check-permissions
```

**Return Codes:**
- `0`: Has sufficient permissions
- `1`: Insufficient permissions

#### `--help`
Shows help information.

```bash
python3 src/universal_mac_spoof.py --help
```

## 🎨 UI Component Events

### DOM Events

#### `interface-selected`
Fired when a network interface is selected from the list.

**Detail:**
```javascript
{
  interface: {
    name: string,
    displayName: string,
    currentMac: string,
    originalMac: string,
    status: string,
    isSpoofed: boolean,
    type: string
  }
}
```

#### `mac-address-changed`
Fired when the MAC address input field changes.

**Detail:**
```javascript
{
  value: string,
  isValid: boolean,
  error?: string
}
```

#### `spoof-attempted`
Fired when a MAC spoofing operation is attempted.

**Detail:**
```javascript
{
  interfaceName: string,
  newMacAddress: string,
  timestamp: number
}
```

#### `spoof-completed`
Fired when a MAC spoofing operation completes.

**Detail:**
```javascript
{
  success: boolean,
  interfaceName: string,
  oldMacAddress: string,
  newMacAddress: string,
  message: string,
  timestamp: number
}
```

### Custom Event Listeners

#### Adding Event Listeners
```javascript
// Listen for interface selection
document.addEventListener('interface-selected', (event) => {
  const selectedInterface = event.detail.interface;
  console.log(`Selected: ${selectedInterface.displayName}`);
});

// Listen for MAC address changes
document.addEventListener('mac-address-changed', (event) => {
  const { value, isValid, error } = event.detail;
  console.log(`MAC changed: ${value}, valid: ${isValid}`);
});

// Listen for spoof completion
document.addEventListener('spoof-completed', (event) => {
  const { success, message } = event.detail;
  if (success) {
    console.log('MAC spoof successful!');
  } else {
    console.error(`MAC spoof failed: ${message}`);
  }
});
```

#### Dispatching Custom Events
```javascript
// Dispatch interface selection
document.dispatchEvent(new CustomEvent('interface-selected', {
  detail: { interface: selectedInterface }
}));

// Dispatch MAC change
document.dispatchEvent(new CustomEvent('mac-address-changed', {
  detail: { value: macValue, isValid: true }
}));
```

## 🔒 Security API

### Input Sanitization

#### `sanitizeInterfaceName(name: string)`
Sanitizes network interface names to prevent command injection.

**Process:**
1. Removes special characters except letters, numbers, hyphens, underscores
2. Limits length to 32 characters
3. Converts to lowercase

#### `sanitizeMacAddress(mac: string)`
Sanitizes MAC address input.

**Process:**
1. Validates format with regex (`^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$`)
2. Converts to lowercase
3. Standardizes separators to colons

### Privilege Verification

#### `verifyAdminPrivileges()`
Comprehensive check for administrator privileges.

**Checks:**
- **Windows**: Process integrity level
- **macOS**: Effective user ID
- **Linux**: Effective user ID and sudo capabilities

#### `requireAdminPrivileges(callback: Function)`
Ensures admin privileges before executing sensitive operations.

## 📊 Error Codes

### IPC Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `E_NO_ADMIN` | Insufficient privileges | Run as administrator/sudo |
| `E_IFACE_NOT_FOUND` | Interface not found | Refresh interface list |
| `E_INVALID_MAC` | Invalid MAC format | Use valid MAC address |
| `E_SPOOF_FAILED` | Spoofing operation failed | Check adapter compatibility |
| `E_RESTORE_FAILED` | Restore operation failed | Check backup files |
| `E_PYTHON_ERROR` | Python script error | Check Python installation |
| `E_PERMISSION_DENIED` | Permission denied | Run with elevated privileges |
| `E_UNKNOWN_ERROR` | Unknown error | Check logs for details |

### Python Script Return Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `0` | Success | Operation completed |
| `1` | Permission denied | Run with sudo/admin |
| `2` | Interface not found | Verify interface name |
| `3` | Invalid MAC address | Use valid format |
| `4` | Operation failed | Check adapter/driver |

## 🔧 Configuration API

### Application Settings

#### `getSettings()`
Retrieves current application settings.

**Returns:**
```javascript
Promise<{
  theme: 'dark' | 'light',
  autoBackup: boolean,
  notifications: boolean,
  language: string,
  lastInterface?: string
}>
```

#### `saveSettings(settings: object)`
Saves application settings.

**Parameters:**
- `settings` (object): Settings to save

#### `resetSettings()`
Resets settings to defaults.

### Build Configuration

#### `getBuildInfo()`
Returns build and version information.

**Returns:**
```javascript
Promise<{
  version: string,
  buildDate: string,
  electronVersion: string,
  nodeVersion: string,
  platform: string,
  arch: string,
  isDevelopment: boolean
}>
```

---

## 📝 Usage Examples

### Complete MAC Spoofing Workflow
```javascript
// 1. Get available interfaces
const interfaces = await window.api.getNetworkInterfaces();

// 2. Select an interface
const targetInterface = interfaces.find(i => i.name === 'en0');

// 3. Generate a random MAC
const newMac = await window.api.generateRandomMac();

// 4. Check admin privileges
const admin = await window.api.checkAdminPrivileges();
if (!admin.hasAdmin) {
  await window.api.showNotification('Administrator privileges required', 'warning');
  return;
}

// 5. Perform spoofing
const result = await window.api.spoofMacAddress(targetInterface.name, newMac);

// 6. Handle result
if (result.success) {
  await window.api.showNotification(
    `MAC changed to ${newMac}`,
    'success'
  );
} else {
  await window.api.showNotification(
    `Failed: ${result.message}`,
    'error'
  );
}
```

### Interface Monitoring
```javascript
// Monitor interface changes
setInterval(async () => {
  const interfaces = await window.api.getNetworkInterfaces();
  const changed = interfaces.filter(i => i.isSpoofed);

  if (changed.length > 0) {
    console.log(`Spoofed interfaces: ${changed.map(i => i.name).join(', ')}`);
  }
}, 5000); // Check every 5 seconds
```

### Error Handling Pattern
```javascript
try {
  const result = await window.api.spoofMacAddress('en0', 'aa:bb:cc:dd:ee:ff');

  if (!result.success) {
    // Handle specific error codes
    switch (result.errorCode) {
      case 'E_NO_ADMIN':
        showAdminRequiredDialog();
        break;
      case 'E_INVALID_MAC':
        showMacValidationError(result.message);
        break;
      case 'E_SPOOF_FAILED':
        showGenericError(result.message);
        break;
      default:
        showUnknownError(result.message);
    }
  }
} catch (error) {
  console.error('Unexpected error:', error);
  await window.api.showNotification('An unexpected error occurred', 'error');
}
```

---

**For more examples, see the source code in `src/app.js` and `src/main.js`.**