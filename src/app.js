class MACSpooferUI {
    constructor() {
        this.selectedInterface = null;
        this.interfaces = [];
        this.statusData = [];
        this.isLoading = false;
        
        this.initializeApp();
    }

    async initializeApp() {
        this.setupEventListeners();
        this.setupRadioHandlers();
        await this.checkAdminPrivileges();
        await this.loadInterfaces();
        await this.loadStatus();
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshAll();
        });

        // Generate random MAC button
        document.getElementById('generateBtn').addEventListener('click', () => {
            const randomMac = window.electronAPI.generateRandomMac();
            document.getElementById('customMacField').value = randomMac;
            this.validateCustomMac();
        });

        // Custom MAC input validation
        document.getElementById('customMacField').addEventListener('input', () => {
            this.validateCustomMac();
        });

        // Spoof button
        document.getElementById('spoofBtn').addEventListener('click', () => {
            this.spoofMacAddress();
        });

        // Restore button
        document.getElementById('restoreBtn').addEventListener('click', () => {
            this.restoreMacAddress();
        });

        // About button
        document.getElementById('aboutBtn').addEventListener('click', () => {
            this.showAboutDialog();
        });

        // Help button
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelpDialog();
        });

        // Authenticate button
        document.getElementById('authBtn').addEventListener('click', () => {
            this.handleAuthenticate();
        });
    }

    setupRadioHandlers() {
        const radioButtons = document.querySelectorAll('input[name="macType"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateMacInputVisibility();
            });
        });
    }

    updateMacInputVisibility() {
        const customMacInput = document.getElementById('customMacInput');
        const customRadio = document.querySelector('input[value="custom"]');
        
        if (customRadio.checked) {
            customMacInput.style.opacity = '1';
            document.getElementById('customMacField').focus();
        } else {
            customMacInput.style.opacity = '0.5';
        }
    }

    async checkAdminPrivileges() {
        try {
            const hasAdmin = await window.electronAPI.checkAdmin();
            const statusElement = document.getElementById('adminStatus');
            const indicator = statusElement.querySelector('.status-indicator');
            const text = statusElement.querySelector('.status-text');
            const authBtn = document.getElementById('authBtn');
            
            if (hasAdmin) {
                indicator.classList.add('admin');
                indicator.classList.remove('no-admin');
                text.textContent = 'Admin privileges';
                authBtn.style.display = 'none';
            } else {
                indicator.classList.add('no-admin');
                indicator.classList.remove('admin');
                text.textContent = 'No admin privileges';
                authBtn.style.display = 'inline-flex';
                
                // Don't show warning on every startup, only when trying to spoof
                console.log('Admin privileges not detected. Authentication will be requested when needed.');
            }
        } catch (error) {
            console.error('Error checking admin privileges:', error);
            this.showToast('error', 'Error', 'Failed to check admin privileges');
        }
    }

    async loadInterfaces() {
        const interfaceList = document.getElementById('interfaceList');
        interfaceList.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading interfaces...</p></div>';

        try {
            this.interfaces = await window.electronAPI.getInterfaces();
            this.renderInterfaces();
        } catch (error) {
            console.error('Error loading interfaces:', error);
            interfaceList.innerHTML = `
                <div class="error-message">
                    <p>❌ Failed to load network interfaces</p>
                    <p class="error-details">${error.message}</p>
                    <button class="btn btn-secondary" onclick="location.reload()">Retry</button>
                </div>
            `;
            this.showToast('error', 'Error', 'Failed to load network interfaces');
        }
    }

    renderInterfaces() {
        const interfaceList = document.getElementById('interfaceList');
        
        if (this.interfaces.length === 0) {
            interfaceList.innerHTML = '<p class="no-interfaces">No network interfaces found</p>';
            return;
        }

        interfaceList.innerHTML = this.interfaces.map(iface => `
            <div class="interface-item" data-interface="${iface.name}">
                <div class="interface-info">
                    <h3>${iface.name}</h3>
                    <p>${iface.mac || 'No MAC address'}</p>
                </div>
                <div class="interface-status">
                    <div class="status-badge original">Original</div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        interfaceList.querySelectorAll('.interface-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectInterface(item.dataset.interface);
            });
        });
    }

    selectInterface(interfaceName) {
        // Update UI selection
        document.querySelectorAll('.interface-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = document.querySelector(`[data-interface="${interfaceName}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }

        // Store selection
        this.selectedInterface = this.interfaces.find(iface => iface.name === interfaceName);
        
        // Update selected interface display
        this.updateSelectedInterfaceDisplay();
        
        // Show MAC options
        document.getElementById('macOptions').style.display = 'block';
    }

    updateSelectedInterfaceDisplay() {
        const selectedInterface = document.getElementById('selectedInterface');
        
        if (!this.selectedInterface) {
            selectedInterface.innerHTML = '<p class="no-selection">Select a network interface to begin</p>';
            return;
        }

        const statusInfo = this.statusData.find(s => s.name === this.selectedInterface.name);
        const isSpoofed = statusInfo?.spoofed || false;
        
        selectedInterface.innerHTML = `
            <div class="selected-info">
                <h3>${this.selectedInterface.name}</h3>
                <div class="selected-details">
                    <span class="label">Current MAC:</span>
                    <span class="value">${this.selectedInterface.mac || 'N/A'}</span>
                    <span class="label">Status:</span>
                    <span class="value">${isSpoofed ? 'Spoofed' : 'Original'}</span>
                    ${statusInfo?.originalMac ? `
                        <span class="label">Original MAC:</span>
                        <span class="value">${statusInfo.originalMac}</span>
                    ` : ''}
                </div>
            </div>
        `;

        // Show/hide restore button
        const restoreBtn = document.getElementById('restoreBtn');
        restoreBtn.style.display = isSpoofed ? 'block' : 'none';
    }

    validateCustomMac() {
        const input = document.getElementById('customMacField');
        const mac = input.value;
        
        if (mac && !window.electronAPI.validateMac(mac)) {
            input.classList.add('invalid');
            return false;
        } else {
            input.classList.remove('invalid');
            return true;
        }
    }

    async handleAuthenticate() {
        try {
            // Try to perform a test authentication
            const result = await window.electronAPI.testAuthentication();
            
            if (result.success) {
                this.showToast('success', 'Authentication Successful', 
                    'Administrator privileges have been granted.');
                await this.checkAdminPrivileges();
            } else {
                if (result.error && result.error.includes('cancelled')) {
                    this.showToast('warning', 'Authentication Cancelled', 
                        'You cancelled the authentication request.');
                } else {
                    this.showToast('error', 'Authentication Failed', 
                        result.error || 'Failed to authenticate. Please try again.');
                }
            }
        } catch (error) {
            console.error('Authentication error:', error);
            this.showToast('error', 'Authentication Error', 
                'An unexpected error occurred during authentication.');
        }
    }

    async spoofMacAddress() {
        if (!this.selectedInterface) {
            this.showToast('warning', 'No Interface Selected', 'Please select a network interface first');
            return;
        }

        const macType = document.querySelector('input[name="macType"]:checked').value;
        let mac = null;

        if (macType === 'custom') {
            mac = document.getElementById('customMacField').value;
            if (!mac) {
                this.showToast('warning', 'MAC Required', 'Please enter a MAC address');
                return;
            }
            if (!this.validateCustomMac()) {
                this.showToast('error', 'Invalid MAC', 'Please enter a valid MAC address');
                return;
            }
            mac = window.electronAPI.normalizeMac(mac);
        }

        this.showLoading('Spoofing MAC address...');

        try {
            const result = await window.electronAPI.spoofMac({
                interface: this.selectedInterface.name,
                mac: mac,
                random: macType === 'random'
            });

            this.hideLoading();

            if (result.success) {
                this.showToast('success', 'Success!', 
                    `MAC address for ${this.selectedInterface.name} has been spoofed successfully`);
                await this.refreshAll();
            } else {
                // Check if it's an authentication issue
                if (result.error && (result.error.includes('cancelled') || result.error.includes('denied'))) {
                    this.showToast('warning', 'Authentication Cancelled', 
                        'MAC spoofing requires administrator privileges. Please authenticate when prompted.');
                } else if (result.error && result.error.includes('not permitted')) {
                    this.showToast('error', 'Permission Denied', 
                        'This operation requires administrator privileges. Click the Authenticate button in the header.');
                } else {
                    this.showToast('error', 'Spoofing Failed', 
                        result.error || 'Failed to spoof MAC address. Make sure you have admin privileges.');
                }
                
                // Re-check admin privileges
                await this.checkAdminPrivileges();
            }
        } catch (error) {
            this.hideLoading();
            console.error('Error spoofing MAC:', error);
            this.showToast('error', 'Error', 'An unexpected error occurred while spoofing MAC address');
        }
    }

    async restoreMacAddress() {
        if (!this.selectedInterface) {
            this.showToast('warning', 'No Interface Selected', 'Please select a network interface first');
            return;
        }

        this.showLoading('Restoring original MAC address...');

        try {
            const result = await window.electronAPI.restoreMac(this.selectedInterface.name);
            
            this.hideLoading();

            if (result.success) {
                this.showToast('success', 'Restored!', 
                    `Original MAC address for ${this.selectedInterface.name} has been restored`);
                await this.refreshAll();
            } else {
                this.showToast('error', 'Restore Failed', 
                    result.error || 'Failed to restore MAC address');
            }
        } catch (error) {
            this.hideLoading();
            console.error('Error restoring MAC:', error);
            this.showToast('error', 'Error', 'An unexpected error occurred while restoring MAC address');
        }
    }

    async loadStatus() {
        const statusGrid = document.getElementById('statusGrid');
        statusGrid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading status...</p></div>';

        try {
            this.statusData = await window.electronAPI.getStatus();
            this.renderStatus();
        } catch (error) {
            console.error('Error loading status:', error);
            statusGrid.innerHTML = '<p class="error-message">❌ Failed to load interface status</p>';
        }
    }

    renderStatus() {
        const statusGrid = document.getElementById('statusGrid');
        
        if (this.statusData.length === 0) {
            statusGrid.innerHTML = '<p class="no-status">No interface status available</p>';
            return;
        }

        statusGrid.innerHTML = this.statusData.map(status => `
            <div class="status-item ${status.spoofed ? 'spoofed' : 'original'}">
                <h3>
                    <span class="icon">${status.spoofed ? '🎭' : '📡'}</span>
                    ${status.name}
                </h3>
                <div class="status-details">
                    <span class="label">Current MAC:</span>
                    <span class="value">${status.currentMac || 'N/A'}</span>
                    <span class="label">Original MAC:</span>
                    <span class="value">${status.originalMac || 'Unknown'}</span>
                    <span class="label">Status:</span>
                    <span class="value">${status.spoofed ? 'Spoofed' : 'Original'}</span>
                </div>
            </div>
        `).join('');
    }

    async refreshAll() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        await Promise.all([
            this.loadInterfaces(),
            this.loadStatus()
        ]);
        this.isLoading = false;
        
        // Update selected interface display if one is selected
        if (this.selectedInterface) {
            this.updateSelectedInterfaceDisplay();
        }
    }

    showLoading(text = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        loadingText.textContent = text;
        overlay.classList.add('show');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('show');
    }

    showToast(type, title, message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };

        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        container.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    async showAboutDialog() {
        await window.electronAPI.showMessage({
            type: 'info',
            title: 'About MAC Address Spoofer',
            message: `MAC Address Spoofer v1.0.0

A cross-platform utility for safely spoofing MAC addresses on Windows, macOS, and Linux.

Features:
• Cross-platform compatibility
• Safe MAC generation (locally administered)
• Original MAC backup and restore
• Comprehensive logging
• Dark mode interface

Created by Jason Paul Michaels

⚠️ Use responsibly and in accordance with local laws and network policies.`
        });
    }

    async showHelpDialog() {
        await window.electronAPI.showMessage({
            type: 'info',
            title: 'Help - MAC Address Spoofer',
            message: `How to use MAC Address Spoofer:

1. ADMIN PRIVILEGES: Make sure to run the application as Administrator (Windows) or with sudo (macOS/Linux)

2. SELECT INTERFACE: Choose a network interface from the list on the left

3. CHOOSE MAC TYPE:
   • Random MAC: Generates a safe, locally administered MAC address
   • Custom MAC: Enter your own MAC address (format: XX:XX:XX:XX:XX:XX)

4. SPOOF: Click "Spoof MAC Address" to apply the changes

5. RESTORE: Use "Restore Original" to revert to the original MAC address

IMPORTANT NOTES:
• Network connection may briefly disconnect during spoofing
• Some network adapters may not support MAC spoofing
• Changes are temporary and reset on system restart
• Always use for legitimate purposes only

For more help, visit the GitHub repository.`
        });
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MACSpooferUI();
});