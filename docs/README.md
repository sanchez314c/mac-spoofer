# Documentation Index — MAC Address Spoofer

Complete documentation for the MAC Address Spoofer Electron application (v1.2.2).

## Getting Started

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](QUICK_START.md) | Five-minute guide: install, launch with privileges, spoof, restore |
| [INSTALLATION.md](INSTALLATION.md) | Full platform-by-platform install instructions (pre-built binaries and from source) |
| [FAQ.md](FAQ.md) | Common questions: legality, adapter compatibility, network reconnection behavior |

## Technical Reference

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Three-layer architecture (renderer → IPC → Python), process isolation, data flow |
| [API.md](API.md) | IPC channel reference: `get-interfaces`, `spoof-mac`, `restore-mac`, `check-admin`, etc. |
| [TECHSTACK.md](TECHSTACK.md) | Runtime versions, dependencies, build targets per platform |

## Development

| Document | Purpose |
|----------|---------|
| [DEVELOPMENT.md](DEVELOPMENT.md) | Dev setup, code standards (JS/CSS/Python), file organization |
| [BUILD_COMPILE.md](BUILD_COMPILE.md) | electron-builder config, multi-platform build commands, output artifact layout |
| [WORKFLOW.md](WORKFLOW.md) | Feature branch flow, release workflow, security checklist before release |

## Operations

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production build pipeline, code signing, GitHub Actions config, distribution channels |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Diagnosed issues by symptom: app won't start, no privileges, interface detection, build failures |

## Project Record

| Document | Purpose |
|----------|---------|
| [PRD.md](PRD.md) | Product requirements, user stories, success metrics, v2.0 considerations |
| [LEARNINGS.md](LEARNINGS.md) | Technical challenges encountered and how they were solved during development |
| [TODO.md](TODO.md) | Current roadmap: open issues, planned features, technical debt |

## Source Overview

```
src/
├── main.js                  # Electron main process — MACSpooferApp class
│                            # Creates BrowserWindow, manages Python subprocess,
│                            # registers 12 ipcMain.handle() channels
├── preload.js               # contextBridge API surface — 12 methods exposed to renderer
│                            # Includes validateMac() and generateRandomMac() utilities
├── app.js                   # Renderer — MACSpooferUI class
│                            # Loads interfaces, handles selection, spoof/restore flow,
│                            # toast system, loading overlay
├── auth-handler.js          # AuthHandler class — platform-specific privilege escalation
│                            # Windows: PowerShell Start-Process -Verb RunAs
│                            # macOS: osascript with administrator privileges
│                            # Linux: pkexec → gksudo → kdesudo → sudo fallback chain
├── index.html               # App shell: title bar, 220px sidebar, config panel, status panel
├── theme.css                # Design token system — 150 CSS custom properties
│                            # Neo-Noir Glass Monitor palette (void black #0a0b0e, teal #14b8a6)
├── styles.css               # Component styles — glass card system, layered shadows,
│                            # hover escalation, toast animations, no backdrop-filter dependency
└── universal_mac_spoof.py   # MACSpoofer class — cross-platform MAC operations
                             # macOS: ifconfig ether; Linux: ip link / ifconfig hw ether
                             # Windows: PowerShell Set-NetAdapter; logs to mac_spoof_log.json
```

## Governance Files (at root)

- [../CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution guide, code standards, PR checklist
- [../CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) — Contributor Covenant v2.1
- [../SECURITY.md](../SECURITY.md) — Vulnerability reporting, security architecture detail
- [../CHANGELOG.md](../CHANGELOG.md) — Version history from v1.0.0 through v1.2.2
- [../AGENTS.md](../AGENTS.md) — AI assistant development guidance
- [../CLAUDE.md](../CLAUDE.md) — Claude Code project instructions
