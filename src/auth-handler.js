const { spawn } = require('child_process');

class AuthHandler {
  constructor() {
    this.platform = process.platform;
  }

  async executeWithAuth(command, args, options = {}) {
    switch (this.platform) {
      case 'win32':
        return this.executeWindows(command, args, options);
      case 'darwin':
        return this.executeMacOS(command, args, options);
      default:
        return this.executeLinux(command, args, options);
    }
  }

  async executeWindows(command, args, options) {
    // On Windows, check if already admin first
    const isAdmin = await this.checkWindowsAdmin();

    if (isAdmin) {
      // Already admin, just run the command
      return new Promise(resolve => {
        const proc = spawn(command, args, options);

        let output = '';
        let error = '';

        proc.stdout.on('data', data => {
          output += data.toString();
        });

        proc.stderr.on('data', data => {
          error += data.toString();
        });

        proc.on('close', code => {
          resolve({
            success: code === 0,
            output,
            error,
          });
        });

        proc.on('error', err => {
          resolve({
            success: false,
            output: '',
            error: err.message,
          });
        });
      });
    } else {
      // Need to elevate - use PowerShell
      return new Promise(resolve => {
        const escapedArgs = args
          .map(arg => `"${arg.replace(/"/g, '""')}"`)
          .join(', ');
        const psCommand = `Start-Process -FilePath "${command}" -ArgumentList ${escapedArgs} -Verb RunAs -Wait -PassThru | ForEach-Object { $_.ExitCode }`;

        const ps = spawn('powershell', ['-Command', psCommand], {
          ...options,
          shell: true,
        });

        let output = '';
        let error = '';

        ps.stdout.on('data', data => {
          output += data.toString();
        });

        ps.stderr.on('data', data => {
          error += data.toString();
        });

        ps.on('close', code => {
          if (code === 0 && output.trim() === '0') {
            resolve({
              success: true,
              output: 'Command executed successfully',
              error: '',
            });
          } else {
            resolve({
              success: false,
              output,
              error: error || 'UAC elevation denied or command failed',
            });
          }
        });

        ps.on('error', err => {
          resolve({
            success: false,
            output: '',
            error: err.message,
          });
        });
      });
    }
  }

  executeMacOS(command, args, options) {
    // On macOS, use osascript to prompt for password
    return new Promise(resolve => {
      // Properly escape arguments for shell script
      const escapedArgs = args
        .map(arg => {
          // Escape single quotes and wrap in quotes
          return `'${arg.replace(/'/g, "'\"'\"'")}'`;
        })
        .join(' ');

      // Build the command string
      const fullCommand = `${command} ${escapedArgs}`;

      // Use osascript with administrator privileges
      const script = `do shell script "${fullCommand}" with administrator privileges`;

      const osascript = spawn('osascript', ['-e', script], options);

      let output = '';
      let error = '';

      osascript.stdout.on('data', data => {
        output += data.toString();
      });

      osascript.stderr.on('data', data => {
        error += data.toString();
      });

      osascript.on('close', code => {
        // Check if user cancelled
        if (error.includes('User canceled') || error.includes('cancelled')) {
          resolve({
            success: false,
            output,
            error: 'Authentication cancelled by user',
          });
        } else {
          resolve({
            success: code === 0,
            output,
            error,
          });
        }
      });

      osascript.on('error', err => {
        resolve({
          success: false,
          output: '',
          error: err.message,
        });
      });
    });
  }

  async executeLinux(command, args, options) {
    // On Linux, try pkexec first, then gksudo, then sudo
    // Try pkexec (PolicyKit)
    const pkexecResult = await this.tryLinuxAuth(
      'pkexec',
      command,
      args,
      options
    );
    if (pkexecResult.success || !pkexecResult.notFound) {
      return pkexecResult;
    }

    // Try gksudo (GNOME)
    const gksudoResult = await this.tryLinuxAuth(
      'gksudo',
      command,
      args,
      options
    );
    if (gksudoResult.success || !gksudoResult.notFound) {
      return gksudoResult;
    }

    // Try kdesudo (KDE)
    const kdesudoResult = await this.tryLinuxAuth(
      'kdesudo',
      command,
      args,
      options
    );
    if (kdesudoResult.success || !kdesudoResult.notFound) {
      return kdesudoResult;
    }

    // Fallback to regular sudo
    const sudoResult = await this.tryLinuxAuth(
      'sudo',
      command,
      args,
      options
    );
    return sudoResult;
  }

  tryLinuxAuth(authCommand, command, args, options) {
    return new Promise(resolve => {
      const authArgs =
        authCommand === 'sudo' ? ['-S', command, ...args] : [command, ...args];
      const auth = spawn(authCommand, authArgs, options);

      let output = '';
      let error = '';
      let notFound = false;

      auth.stdout.on('data', data => {
        output += data.toString();
      });

      auth.stderr.on('data', data => {
        error += data.toString();
      });

      auth.on('error', err => {
        if (err.code === 'ENOENT') {
          notFound = true;
        }
        resolve({
          success: false,
          output: '',
          error: err.message,
          notFound,
        });
      });

      auth.on('close', code => {
        resolve({
          success: code === 0,
          output,
          error,
          notFound,
        });
      });
    });
  }

  async checkAdminPrivileges() {
    switch (this.platform) {
      case 'win32':
        return this.checkWindowsAdmin();
      case 'darwin':
        return this.checkMacOSAdmin();
      default:
        return this.checkLinuxAdmin();
    }
  }

  checkWindowsAdmin() {
    return new Promise(resolve => {
      const net = spawn('net', ['session'], { stdio: 'pipe' });
      net.on('close', code => {
        resolve(code === 0);
      });
      net.on('error', () => {
        resolve(false);
      });
    });
  }

  checkMacOSAdmin() {
    return new Promise(resolve => {
      const sudo = spawn('sudo', ['-n', 'true'], { stdio: 'pipe' });
      sudo.on('close', code => {
        resolve(code === 0);
      });
      sudo.on('error', () => {
        resolve(false);
      });
    });
  }

  checkLinuxAdmin() {
    return new Promise(resolve => {
      const sudo = spawn('sudo', ['-n', 'true'], { stdio: 'pipe' });
      sudo.on('close', code => {
        resolve(code === 0);
      });
      sudo.on('error', () => {
        resolve(false);
      });
    });
  }
}

module.exports = AuthHandler;
