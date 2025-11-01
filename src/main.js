const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const AuthHandler = require('./auth-handler');

class MACSpooferApp {
  constructor() {
    this.mainWindow = null;
    this.isDev = process.argv.includes('--dev');
    this.authHandler = new AuthHandler();
    this.initializeApp();
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
    this.mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      backgroundColor: '#1a1a1a',
      show: false,
      icon: this.getAppIcon(),
    });

    this.mainWindow.loadFile(path.join(__dirname, 'index.html'));

    if (this.isDev) {
      this.mainWindow.webContents.openDevTools();
    }

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
          const pythonCmd = await this.findPythonCommand();
          const pythonScript = this.getPythonScript();
          const args = [pythonScript, '-i', interfaceName, '--yes']; // Add --yes for auto-confirm

          if (random) {
            args.push('-r');
          } else if (mac) {
            args.push('-m', mac);
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
        const pythonCmd = await this.findPythonCommand();
        const pythonScript = this.getPythonScript();
        const args = [pythonScript, '--restore', interfaceName, '--yes']; // Add --yes for auto-confirm

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

    // Open external link
    ipcMain.handle('open-external', async (event, url) => {
      await shell.openExternal(url);
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
