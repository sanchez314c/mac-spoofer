#!/usr/bin/env python3
"""
Universal MAC Address Spoofer
Author: Cortana for Jason Paul Michaels
Date: 2025-06-28

A cross-platform script for safely spoofing MAC addresses with proper validation
and system-specific handling for macOS, Windows, and Linux.
"""

import os
import sys
import random
import subprocess
import platform
import re
import json
from datetime import datetime
import argparse

class MACSpoofer:
    def __init__(self):
        self.system = platform.system().lower()
        self.original_macs = {}
        self.log_file = "mac_spoof_log.json"
        
    def generate_safe_mac(self):
        """Generate a safe, locally administered MAC address"""
        # Locally administered unicast MAC (second bit of first octet = 1)
        # First octet: 02, 06, 0A, 0E (even numbers with bit 1 set)
        first_octets = ['02', '06', '0A', '0E']
        first = random.choice(first_octets)
        
        # Generate remaining 5 octets
        remaining = [f"{random.randint(0, 255):02x}" for _ in range(5)]
        
        mac = f"{first}:{':'.join(remaining)}"
        return mac.upper()
    
    def validate_mac(self, mac):
        """Validate MAC address format"""
        pattern = r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$'
        return bool(re.match(pattern, mac))
    
    def normalize_mac(self, mac):
        """Normalize MAC address format"""
        return mac.replace('-', ':').upper()
    
    def get_interfaces(self):
        """Get network interfaces based on OS"""
        interfaces = []
        
        if self.system == 'darwin':  # macOS
            try:
                result = subprocess.run(['networksetup', '-listallhardwareports'], 
                                      capture_output=True, text=True)
                lines = result.stdout.split('\n')
                for i, line in enumerate(lines):
                    if 'Device:' in line:
                        device = line.split('Device: ')[1].strip()
                        if device and not device.startswith('bridge'):
                            interfaces.append(device)
            except:
                # Fallback
                interfaces = ['en0', 'en1', 'en2']
                
        elif self.system == 'linux':
            try:
                result = subprocess.run(['ip', 'link', 'show'], 
                                      capture_output=True, text=True)
                for line in result.stdout.split('\n'):
                    if ': ' in line and 'state' in line:
                        interface = line.split(': ')[1].split('@')[0]
                        if interface not in ['lo', 'docker0'] and not interface.startswith('veth'):
                            interfaces.append(interface)
            except:
                # Fallback
                interfaces = ['eth0', 'wlan0', 'enp0s3']
                
        elif self.system == 'windows':
            try:
                result = subprocess.run(['wmic', 'path', 'win32_networkadapter', 
                                       'get', 'name,netconnectionid'], 
                                      capture_output=True, text=True)
                # Parse Windows adapter names
                for line in result.stdout.split('\n')[1:]:
                    if line.strip() and 'Ethernet' in line:
                        interfaces.append(line.strip())
            except:
                print("Note: Windows interface detection requires admin privileges")
                
        return interfaces
    
    def get_current_mac(self, interface):
        """Get current MAC address of interface"""
        try:
            if self.system == 'darwin':  # macOS
                result = subprocess.run(['ifconfig', interface], 
                                      capture_output=True, text=True)
                for line in result.stdout.split('\n'):
                    if 'ether' in line:
                        return line.split('ether ')[1].split(' ')[0].upper()
                        
            elif self.system == 'linux':
                result = subprocess.run(['cat', f'/sys/class/net/{interface}/address'], 
                                      capture_output=True, text=True)
                return result.stdout.strip().upper()
                
            elif self.system == 'windows':
                result = subprocess.run(['getmac', '/fo', 'csv', '/nh'], 
                                      capture_output=True, text=True)
                for line in result.stdout.split('\n'):
                    if interface in line:
                        return line.split(',')[0].replace('"', '').replace('-', ':')
                        
        except Exception as e:
            print(f"Error getting MAC for {interface}: {e}")
            
        return None
    
    def spoof_mac_macos(self, interface, new_mac):
        """Spoof MAC on macOS"""
        commands = [
            ['sudo', 'ifconfig', interface, 'down'],
            ['sudo', 'ifconfig', interface, 'ether', new_mac],
            ['sudo', 'ifconfig', interface, 'up']
        ]
        
        for cmd in commands:
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"Error executing: {' '.join(cmd)}")
                print(f"Error: {result.stderr}")
                return False
                
        return True
    
    def spoof_mac_linux(self, interface, new_mac):
        """Spoof MAC on Linux"""
        # Try ip command first
        commands = [
            ['sudo', 'ip', 'link', 'set', 'dev', interface, 'down'],
            ['sudo', 'ip', 'link', 'set', 'dev', interface, 'address', new_mac],
            ['sudo', 'ip', 'link', 'set', 'dev', interface, 'up']
        ]
        
        for cmd in commands:
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                # Fallback to ifconfig
                if 'ip' in cmd:
                    fallback_commands = [
                        ['sudo', 'ifconfig', interface, 'down'],
                        ['sudo', 'ifconfig', interface, 'hw', 'ether', new_mac],
                        ['sudo', 'ifconfig', interface, 'up']
                    ]
                    
                    for fallback_cmd in fallback_commands:
                        result = subprocess.run(fallback_cmd, capture_output=True, text=True)
                        if result.returncode != 0:
                            print(f"Error executing: {' '.join(fallback_cmd)}")
                            return False
                    break
                else:
                    print(f"Error executing: {' '.join(cmd)}")
                    return False
                    
        return True
    
    def spoof_mac_windows(self, interface, new_mac):
        """Spoof MAC on Windows (requires admin)"""
        # Format MAC for Windows (remove colons)
        windows_mac = new_mac.replace(':', '')
        
        try:
            # Using PowerShell method
            ps_command = f'Set-NetAdapter -Name "{interface}" -MacAddress "{new_mac}"'
            result = subprocess.run(['powershell', '-Command', ps_command], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                return True
            else:
                print(f"PowerShell method failed: {result.stderr}")
                print("Try running as Administrator or use Device Manager method")
                return False
                
        except Exception as e:
            print(f"Windows MAC spoofing error: {e}")
            return False
    
    def spoof_mac(self, interface, new_mac=None):
        """Main MAC spoofing function"""
        if not new_mac:
            new_mac = self.generate_safe_mac()
            
        if not self.validate_mac(new_mac):
            print(f"Invalid MAC address format: {new_mac}")
            return False
            
        new_mac = self.normalize_mac(new_mac)
        
        # Store original MAC
        original_mac = self.get_current_mac(interface)
        if original_mac:
            self.original_macs[interface] = original_mac
            
        print(f"Spoofing {interface}: {original_mac} → {new_mac}")
        
        # Platform-specific spoofing
        success = False
        if self.system == 'darwin':
            success = self.spoof_mac_macos(interface, new_mac)
        elif self.system == 'linux':
            success = self.spoof_mac_linux(interface, new_mac)
        elif self.system == 'windows':
            success = self.spoof_mac_windows(interface, new_mac)
        else:
            print(f"Unsupported operating system: {self.system}")
            
        if success:
            self.log_change(interface, original_mac, new_mac)
            print(f"✅ Successfully spoofed {interface} to {new_mac}")
        else:
            print(f"❌ Failed to spoof {interface}")
            
        return success
    
    def restore_mac(self, interface):
        """Restore original MAC address"""
        if interface in self.original_macs:
            original_mac = self.original_macs[interface]
            print(f"Restoring {interface} to original MAC: {original_mac}")
            return self.spoof_mac(interface, original_mac)
        else:
            print(f"No original MAC stored for {interface}")
            return False
    
    def log_change(self, interface, original, new):
        """Log MAC address changes"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'interface': interface,
            'original_mac': original,
            'new_mac': new,
            'system': self.system
        }
        
        try:
            if os.path.exists(self.log_file):
                with open(self.log_file, 'r') as f:
                    logs = json.load(f)
            else:
                logs = []
                
            logs.append(log_entry)
            
            with open(self.log_file, 'w') as f:
                json.dump(logs, f, indent=2)
                
        except Exception as e:
            print(f"Warning: Could not write to log file: {e}")
    
    def show_status(self):
        """Show current network interface status"""
        print(f"\n🖥️  System: {platform.system()} {platform.release()}")
        print("📡 Network Interfaces:")
        print("-" * 50)
        
        interfaces = self.get_interfaces()
        if not interfaces:
            print("No network interfaces found")
            return
            
        for interface in interfaces:
            current_mac = self.get_current_mac(interface)
            original = self.original_macs.get(interface, "Unknown")
            spoofed = "Yes" if interface in self.original_macs else "No"
            
            print(f"Interface: {interface}")
            print(f"  Current MAC: {current_mac or 'N/A'}")
            print(f"  Original MAC: {original}")
            print(f"  Spoofed: {spoofed}")
            print()

def main():
    parser = argparse.ArgumentParser(description='Universal MAC Address Spoofer')
    parser.add_argument('-i', '--interface', help='Network interface to spoof')
    parser.add_argument('-m', '--mac', help='Specific MAC address to use')
    parser.add_argument('-r', '--random', action='store_true', help='Use random MAC')
    parser.add_argument('-s', '--status', action='store_true', help='Show interface status')
    parser.add_argument('-R', '--restore', help='Restore original MAC for interface')
    parser.add_argument('-l', '--list', action='store_true', help='List available interfaces')
    parser.add_argument('-y', '--yes', action='store_true', help='Auto-confirm (no prompts)')
    
    args = parser.parse_args()
    
    spoofer = MACSpoofer()
    
    if args.status:
        spoofer.show_status()
        return
    
    if args.list:
        interfaces = spoofer.get_interfaces()
        print("Available network interfaces:")
        for interface in interfaces:
            mac = spoofer.get_current_mac(interface)
            print(f"  {interface}: {mac or 'N/A'}")
        return
    
    if args.restore:
        if spoofer.restore_mac(args.restore):
            print(f"✅ Restored {args.restore}")
        else:
            print(f"❌ Failed to restore {args.restore}")
        return
    
    # For non-interactive operations (GUI), skip interface selection
    if not args.interface and not args.yes:
        print("Available interfaces:")
        interfaces = spoofer.get_interfaces()
        for i, interface in enumerate(interfaces):
            mac = spoofer.get_current_mac(interface)
            print(f"  [{i+1}] {interface}: {mac or 'N/A'}")
            
        try:
            choice = int(input("\nSelect interface (number): ")) - 1
            if 0 <= choice < len(interfaces):
                args.interface = interfaces[choice]
            else:
                print("Invalid selection")
                return
        except (ValueError, KeyboardInterrupt):
            print("\nOperation cancelled")
            return
    
    if args.random or not args.mac:
        new_mac = spoofer.generate_safe_mac()
        if not args.yes:
            print(f"Generated safe MAC: {new_mac}")
    else:
        new_mac = args.mac
    
    # Skip confirmation if --yes flag is set or input is piped
    if not args.yes and sys.stdin.isatty():
        print(f"\nAbout to spoof {args.interface} to {new_mac}")
        try:
            confirm = input("Continue? (y/N): ").lower()
            if confirm != 'y':
                print("Operation cancelled")
                return
        except (KeyboardInterrupt, EOFError):
            print("\nOperation cancelled")
            return
    
    # Perform spoofing
    if spoofer.spoof_mac(args.interface, new_mac):
        print("\n🎉 MAC spoofing completed!")
        if not args.yes:
            print("💡 Tip: Use --restore to revert changes")
    else:
        print("\n❌ MAC spoofing failed")
        if spoofer.system == 'windows':
            print("💡 On Windows, try running as Administrator")
        elif spoofer.system in ['linux', 'darwin']:
            print("💡 Make sure you have sudo privileges")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user")
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        import traceback
        traceback.print_exc()
