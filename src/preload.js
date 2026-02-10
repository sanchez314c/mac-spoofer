const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Interface operations
  getInterfaces: () => ipcRenderer.invoke('get-interfaces'),
  getStatus: () => ipcRenderer.invoke('get-status'),

  // MAC operations
  spoofMac: data => ipcRenderer.invoke('spoof-mac', data),
  restoreMac: interface => ipcRenderer.invoke('restore-mac', interface),

  // System operations
  checkAdmin: () => ipcRenderer.invoke('check-admin'),
  testAuthentication: () => ipcRenderer.invoke('test-authentication'),

  // UI operations
  showMessage: data => ipcRenderer.invoke('show-message', data),
  openExternal: url => ipcRenderer.invoke('open-external', url),

  // Window controls — using invoke for proper IPC protocol (not send)
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  // Utility functions
  validateMac: mac => {
    const pattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return pattern.test(mac);
  },

  generateRandomMac: () => {
    const firstOctets = ['02', '06', '0A', '0E'];
    const first = firstOctets[Math.floor(Math.random() * firstOctets.length)];
    const remaining = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
    );
    return `${first}:${remaining.join(':')}`.toUpperCase();
  },

  normalizeMac: mac => {
    return mac.replace(/-/g, ':').toUpperCase();
  },
});
