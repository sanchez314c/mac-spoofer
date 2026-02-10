const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const AuthHandler = require('./auth-handler');

// ── Platform-specific Chromium flags for transparent frameless window ──
// These must be set BEFORE app.ready fires — works in source AND packaged builds.
if (process.platform === 'linux') {
  // Required for transparent BrowserWindow on Linux compositors (X11/Wayland)
  app.commandLine.appendSwitch('enable-transparent-visuals');
  // Brief delay needed on some Linux DEs for transparency to initialize
  app.commandLine.appendSwitch('disable-gpu-compositing');
}

class MACSpooferApp {
  constructor() {
    this.mainWindow = null;
    this.isDev = process.argv.includes('--dev');
    this.authHandler = new AuthHandler();
    this.initializeApp();
  }

  /** Validate interface name — whitelist: alphanumeric, underscore, hyphen, dot */
  sanitizeInterfaceName(name) {
    if (typeof name !== 'string' || !/^[a-zA-Z0-9_.\-]{1,32}$/.test(name)) {
      throw new Error('Invalid interface name');
    }
    return name;
  }

  /** Validate MAC address format strictly */
  sanitizeMacAddress(mac) {
    if (typeof mac !== 'string') throw new Error('Invalid MAC address');
    const normalized = mac.replace(/-/g, ':').toUpperCase();
    if (!/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(normalized)) {
      throw new Error('Invalid MAC address format');
    }
    return normalized;
  }

  initializeApp() {
    app.whenReady().then(() => {
      this.createWindow();
      this.setupIpcHandlers();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  createWindow() {
    const isMac = process.platform === 'darwin';

    // Window dimensions: 220px sidebar + 600px min content + 32px body padding = 852px min
    this.mainWindow = new BrowserWindow({
      width: 1100,
      height: 850,
      minWidth: 880,
      minHeight: 620,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      hasShadow: false,                    // NO OS shadow — CSS handles depth
      roundedCorners: true,
      resizable: true,
      // macOS ONLY — do NOT set titleBarStyle on Linux/Windows
      ...(isMac ? { titleBarStyle: 'hiddenInset' } : {}),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        sandbox: false,             // Required for preload script functionality
        // NEVER set experimentalFeatures: true — it BREAKS contextBridge IPC on Linux
      },
      show: false,
      icon: this.getAppIcon(),
    });

    this.mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // DevTools available manually via Ctrl+Shift+I (Linux/Win) or Cmd+Option+I (macOS)

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
    });
  }

  getAppIcon() {
    const iconPath = path.join(__dirname, '..', 'resources', 'icons');
    if (process.platform === 'win32') {
      return path.join(iconPath, 'icon.ico');
    } else if (process.platform === 'darwin') {
      return path.join(iconPath, 'icon.icns');
    } else {
      return path.join(iconPath, 'icon.png');
    }
  }

  getPythonScript() {
    if (app.isPackaged) {
      return path.join(process.resourcesPath, 'src', 'universal_mac_spoof.py');
    } else {
      return path.join(__dirname, 'universal_mac_spoof.py');
    }
  }

  async findPythonCommand() {
    const pythonCommands = ['python3', 'python', 'py'];

    for (const cmd of pythonCommands) {
      try {
        const result = await new Promise(resolve => {
          const test = spawn(cmd, ['--version'], { stdio: 'pipe' });
          test.on('close', code => resolve(code === 0));
          test.on('error', () => resolve(false));
        });

        if (result) {
          return cmd;
        }
      } catch {
        continue;
      }
    }

    throw new Error('Python not found. Please install Python 3.');
  }

  async executePythonScript(args) {
    const pythonCmd = await this.findPythonCommand();
    const pythonScript = this.getPythonScript();

    return new Promise((resolve, reject) => {
      const process = spawn(pythonCmd, [pythonScript, ...args]);

      let output = '';
      let error = '';

      process.stdout.on('data', data => {
        output += data.toString();
      });

      process.stderr.on('data', data => {
        error += data.toString();
      });

      process.on('close', code => {
        if (code === 0) {
          resolve({ success: true, output, error });
        } else {
          reject(new Error(error || 'Python script execution failed'));
        }
      });

      process.on('error', err => {
        reject(new Error(`Failed to execute Python script: ${err.message}`));
      });
    });
  }

  setupIpcHandlers() {
    // Get available network interfaces
    ipcMain.handle('get-interfaces', async () => {
      const result = await this.executePythonScript(['--list']);
      const interfaces = this.parseInterfaceOutput(result.output);
      return interfaces;
    });

    // Get interface status
    ipcMain.handle('get-status', async () => {
      const result = await this.executePythonScript(['--status']);
      const status = this.parseStatusOutput(result.output);
      return status;
    });

    // Spoof MAC address
    ipcMain.handle(
      'spoof-mac',
      async (event, { interface: interfaceName, mac, random }) => {
        try {
          const safeInterface = this.sanitizeInterfaceName(interfaceName);
          const pythonCmd = await this.findPythonCommand();
          const pythonScript = this.getPythonScript();
          const args = [pythonScript, '-i', safeInterface, '--yes'];

          if (random) {
            args.push('-r');
          } else if (mac) {
            const safeMac = this.sanitizeMacAddress(mac);
            args.push('-m', safeMac);
          }

          const result = await this.authHandler.executeWithAuth(
            pythonCmd,
            args
          );
          return result;
        } catch (error) {
          return {
            success: false,
            output: '',
            error: error.message || 'Authentication failed',
          };
        }
      }
    );

    // Restore MAC address
    ipcMain.handle('restore-mac', async (event, interfaceName) => {
      try {
        const safeInterface = this.sanitizeInterfaceName(interfaceName);
        const pythonCmd = await this.findPythonCommand();
        const pythonScript = this.getPythonScript();
        const args = [pythonScript, '--restore', safeInterface, '--yes'];

        const result = await this.authHandler.executeWithAuth(pythonCmd, args);
        return result;
      } catch (error) {
        return {
          success: false,
          output: '',
          error: error.message || 'Authentication failed',
        };
      }
    });

    // Show message box
    ipcMain.handle('show-message', async (event, { type, title, message }) => {
      const result = await dialog.showMessageBox(this.mainWindow, {
        type: type,
        title: title,
        message: message,
        buttons: ['OK'],
      });
      return result;
    });

    // Open external link — validate protocol to prevent arbitrary code execution
    ipcMain.handle('open-external', async (event, url) => {
      try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          return { success: false, error: 'Invalid URL protocol' };
        }
        await shell.openExternal(url);
      } catch {
        return { success: false, error: 'Invalid URL' };
      }
    });

    // Check admin privileges
    ipcMain.handle('check-admin', async () => {
      return await this.authHandler.checkAdminPrivileges();
    });

    // Test authentication
    ipcMain.handle('test-authentication', async () => {
      try {
        // Run a harmless command that requires admin to test authentication
        const testCommand = process.platform === 'win32' ? 'net' : 'echo';
        const testArgs = process.platform === 'win32' ? ['session'] : ['test'];

        const result = await this.authHandler.executeWithAuth(
          testCommand,
          testArgs
        );
        return result;
      } catch (error) {
        return {
          success: false,
          output: '',
          error: error.message || 'Authentication test failed',
        };
      }
    });

    // Window controls — using ipcMain.handle for proper IPC protocol
    ipcMain.handle('minimize-window', async () => {
      if (this.mainWindow) this.mainWindow.minimize();
    });

    ipcMain.handle('maximize-window', async () => {
      if (this.mainWindow) {
        this.mainWindow.isMaximized() ? this.mainWindow.unmaximize() : this.mainWindow.maximize();
      }
    });

    ipcMain.handle('close-window', async () => {
      if (this.mainWindow) this.mainWindow.close();
    });

    ipcMain.handle('window-is-maximized', () => {
      return this.mainWindow ? this.mainWindow.isMaximized() : false;
    });
  }

  parseInterfaceOutput(output) {
    const interfaces = [];
    const lines = output.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and header lines
      if (trimmed && trimmed.includes(':') && !trimmed.includes('Available')) {
        // Match interface pattern like "en0: 18:C0:4D:0E:62:02"
        const match = trimmed.match(/^\s*(\w+):\s*([0-9A-Fa-f:]+|N\/A)$/);
        if (match) {
          interfaces.push({
            name: match[1],
            mac: match[2] === 'N/A' ? null : match[2].toUpperCase(),
          });
        }
      }
    }

    return interfaces;
  }

  parseStatusOutput(output) {
    const interfaces = [];
    const lines = output.split('\n');
    let currentInterface = null;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('Interface:')) {
        if (currentInterface) {
          interfaces.push(currentInterface);
        }
        currentInterface = {
          name: trimmed.replace('Interface:', '').trim(),
          currentMac: null,
          originalMac: null,
          spoofed: false,
        };
      } else if (currentInterface) {
        if (trimmed.startsWith('Current MAC:')) {
          const mac = trimmed.replace('Current MAC:', '').trim();
          currentInterface.currentMac =
            mac === 'N/A' ? null : mac.toUpperCase();
        } else if (trimmed.startsWith('Original MAC:')) {
          const mac = trimmed.replace('Original MAC:', '').trim();
          currentInterface.originalMac =
            mac === 'Unknown' || mac === 'N/A' ? null : mac.toUpperCase();
        } else if (trimmed.startsWith('Spoofed:')) {
          currentInterface.spoofed =
            trimmed.replace('Spoofed:', '').trim() === 'Yes';
        }
      }
    }

    if (currentInterface) {
      interfaces.push(currentInterface);
    }

    return interfaces;
  }
}

new MACSpooferApp();
