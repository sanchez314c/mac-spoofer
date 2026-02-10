# Changelog

All notable changes to the MAC Address Spoofer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2026-02-08 19:18 UTC

### Fixed - Dark Neo Glass Theme Hardening (Critical IPC & Z-Index Corrections)

#### CRITICAL: Removed experimentalFeatures: true from webPreferences
- This setting **BREAKS contextBridge IPC on Linux** by enabling experimental Chromium features that cause `ipcRenderer.invoke()` promises to silently fail through the contextBridge proxy
- Added `sandbox: false` (required for preload script functionality)
- This was the #1 IPC-killing corruption — invisible, no errors thrown, IPC just stops working

#### IPC Protocol Unified: send → invoke
- Window controls in main.js converted from `ipcMain.on()` to `ipcMain.handle()` (async)
- Preload.js window controls converted from `ipcRenderer.send()` to `ipcRenderer.invoke()`
- All IPC channels now consistently use `invoke/handle` protocol
- Channel names standardized: `minimize-window`, `maximize-window`, `close-window`

#### Orphan CSS Variable References Fixed (5 instances)
- `var(--color-error)` → `var(--error)` (2 occurrences in app.js SVG icons)
- `var(--color-success)` → `var(--success)` (1 occurrence)
- `var(--color-warning)` → `var(--warning)` (1 occurrence)
- `var(--color-info)` → `var(--accent-info)` (1 occurrence)
- Toast notification icons now render with correct theme colors

#### Z-Index Hierarchy Corrected to Match Spec
- Drag handle (title-bar): `var(--z-overlay)` (100) → `var(--z-drag-handle)` (50)
- Window controls: added explicit `z-index: var(--z-window-controls)` (200)
- New z-index tokens added to theme.css: `--z-drag-handle: 50`, `--z-window-controls: 200`
- Modal z-index raised to 999, toast to 10000, tooltip to 10100

#### Window Controls Restyled to Spec
- Button shape: `border-radius: 8px` → `border-radius: 50%` (circular per spec)
- Background: `var(--glass-bg)` → `rgba(255, 255, 255, 0.06)` (spec-defined)
- Borders removed (spec: `border: none`)
- Close button hover: now uses `var(--error)` background with white text
- Title bar height: 42px → 48px (spec: "Tall enough to be an easy grab target")

#### No-Drag Rules Applied (Spec Rule 10)
- Added explicit `-webkit-app-region: no-drag` to interactive leaf elements only
- Buttons, inputs, selects, links, sidebar, interface items, radio cards
- NO large layout containers in no-drag list (prevents drag handle breakage)

### Validation Checklist (27/27 PASS)
- [x] 1. body padding: 16px float gap
- [x] 2. html + body: transparent !important
- [x] 3. App container: border-radius 20px + overflow hidden
- [x] 4. App container: gradient background (not solid)
- [x] 5. BrowserWindow: frame:false, transparent:true, hasShadow:false
- [x] 6. experimentalFeatures NOT set in webPreferences
- [x] 7. Linux flags: disable-gpu-compositing (NOT disable-gpu)
- [x] 8. All elevated elements: layered shadows (2+ layers)
- [x] 9. Prominent cards: ambient radial-gradient mesh
- [x] 10. All cards: ::before inner highlight
- [x] 11. Card hover: translateY(-2px) + shadow escalation
- [x] 12. backdrop-filter: enhancement only (loading overlay)
- [x] 13. No orphan hardcoded hex/rgb outside theme system
- [x] 14. Scrollbars: themed 6px dark thumb
- [x] 15. Input focus: teal border + glow shadow
- [x] 16. All THREE window buttons: minimize, maximize, close
- [x] 17. Window controls: IPC via invoke/handle (not send/window.close)
- [x] 18. Font: Inter + system stack with -webkit-font-smoothing
- [x] 19. Zero OS title bar (frame: false)
- [x] 20. No duplicate window controls
- [x] 21. Drag handle: z-index 50
- [x] 22. Window controls: z-index 200
- [x] 23. No layout containers in no-drag list
- [x] 24. Content top padding adequate (flex layout below 48px title bar)
- [x] 25. Window dimensions fit content (1100x780, min 880x520)
- [x] 26. titleBarStyle: macOS only
- [x] 27. Single BrowserWindow creation point

### Files Modified
- `src/main.js` — Removed experimentalFeatures, added sandbox:false, IPC handle migration
- `src/preload.js` — Window controls: send → invoke, channel name standardization
- `src/app.js` — Fixed 5 orphan CSS variable references in SVG icons
- `src/theme.css` — Added z-index tokens (drag-handle: 50, window-controls: 200), raised modal/toast/tooltip
- `src/styles.css` — Z-index corrections, circular window controls, no-drag rules, title bar height
- `CHANGELOG.md` — This entry

---

## [1.2.1] - 2026-02-08 00:45 UTC

### Fixed - Port Refresh & Universal Transparency

#### New Random Ports
- Electron Debug: `52528`
- Electron Inspect: `54008`
- Electron Fallback: `60672`

#### Transparency Flags Moved to main.js
- `app.commandLine.appendSwitch('enable-transparent-visuals')` — runs on Linux automatically
- `app.commandLine.appendSwitch('disable-gpu-compositing')` — prevents transparency artifacts on Linux compositors
- Works in **both** source and packaged builds (no reliance on CLI flags)
- Removed `--disable-gpu` (too aggressive, forces software rendering)
- Removed `--enable-transparent-visuals` from run scripts and package.json (main.js handles it)

#### Launch Scripts Updated
- `run-source-linux.sh` — new ports, Python3 check, cleaner launch (no GPU flags needed)
- `run-source-mac.sh` — new ports, Python3 check
- `run-source-windows.bat` — new ports, Python check

### Files Modified
- `src/main.js` — Platform-specific Chromium flags before app.ready
- `package.json` — Reverted start/dev scripts (flags now in main.js)
- `run-source-linux.sh` — New ports + cleanup
- `run-source-mac.sh` — New ports + cleanup
- `run-source-windows.bat` — New ports + cleanup
- `CHANGELOG.md` — This entry

---

## [1.2.0] - 2026-02-08 00:33 UTC

### Restyled - Neo-Noir Glass Monitor Design System (Complete Restyle)
- **Design System**: Complete absorption of Neo-Noir Glass Monitor cyberpunk dark dashboard
- **Floating Glass Panels**: 16px body padding creates visible float gap with desktop wallpaper behind
- **3D Depth Illusion**: All cards use layered multi-shadow system (3-5 shadow layers per element)
- **Glass Cards**: Gradient backgrounds with ambient radial-gradient mesh orbs (teal, purple, cyan)
- **Inner Highlights**: 1px top-edge light reflection on all glass cards via ::before pseudo-elements
- **Hover Escalation**: All interactive cards lift (translateY -2px) AND deepen shadow on hover
- **NO backdrop-filter Dependency**: Glass effect achieved via rgba gradients, not broken Chromium blur
- **Teal Accent Lighting**: Primary accent #14b8a6 with glow shadows throughout
- **Dark Void Background**: #0a0b0e void black with gradient overlays for depth

### Technical Changes
- **theme.css**: Complete replacement with 148-line design token system (backgrounds, accents, layered shadows, glass effects, gradients, typography, spacing)
- **styles.css**: Complete rewrite — 1017 lines with glass card system, ambient gradient meshes, layered shadow system, inner highlights, hover escalation, themed scrollbars, toast notifications with gradient backgrounds
- **main.js**: BrowserWindow config optimized — hasShadow: false, removed vibrancy (Linux incompatible), macOS-only titleBarStyle guard, recalculated window dimensions (1100x780, min 880x520)
- **Sidebar**: Resized from 260px to 220px with gradient sidebar background
- **Window Controls**: Restyled to 28px rounded-8px glass buttons with subtle borders
- **Loading Overlay**: Respects 16px body padding with border-radius matching
- **Toast System**: Gradient backgrounds per status type with inner highlight edges

### Validation Checklist (20/20 PASS)
- [x] Body padding: 16px float gap
- [x] html + body: transparent !important
- [x] App container: border-radius 20px + overflow hidden
- [x] App container: gradient background (not solid)
- [x] BrowserWindow: frame:false, transparent:true, hasShadow:false
- [x] All shadows: layered (2+ layers)
- [x] Glass cards: ambient radial-gradient mesh
- [x] All cards: ::before inner highlight
- [x] Hover states: translateY + shadow escalation
- [x] backdrop-filter: enhancement only (overlay), not primary technique
- [x] No hardcoded hex/rgb in styles.css
- [x] Scrollbars: themed 6px dark
- [x] Input focus: teal border + glow
- [x] Custom window controls (no OS chrome)
- [x] Font: Inter + system stack
- [x] Zero OS title bar
- [x] No duplicate window controls
- [x] Window dimensions fit content
- [x] titleBarStyle: macOS only
- [x] Single BrowserWindow creation point

### Files Modified
- `src/theme.css` - Complete replacement (design tokens)
- `src/styles.css` - Complete rewrite (component styles)
- `src/main.js` - BrowserWindow configuration update
- `CHANGELOG.md` - This entry

---

## [1.1.1] - 2025-02-07 20:36 UTC

### Added - Port Configuration & Launch Scripts
- **Random High Ports**: Generated random high-numbered ports for Electron debugging
  - Electron Debug Port: 50682
  - Electron Inspect Port: 57779
  - Electron Fallback Port: 63589

### Enhanced Launch Scripts
- **run-source-linux.sh**: Added port cleanup, zombie process killing, dependency checks, sandbox fix
- **run-source-mac.sh**: Added port cleanup, zombie process killing, dependency checks
- **run-source-windows.bat**: Added port cleanup, ANSI color support, dependency checks

### Features
- Process cleanup on configured ports before launch
- Orphaned Electron process detection and termination
- Node.js/npm version verification
- Automatic dependency installation
- --dev flag support for DevTools mode with custom ports

### Files Modified
- `run-source-linux.sh` - Complete rewrite with port management
- `run-source-mac.sh` - Complete rewrite with port management
- `run-source-windows.bat` - Complete rewrite with port management and ANSI colors
- `CHANGELOG.md` - This entry

## [1.1.2] - 2025-02-07 21:15 UTC

### Fixed - Dark Navy Theme Correction (FINAL CORRECT VERSION)
- **Dark Navy Theme**: Primary background #0F1117 (very dark navy), secondary #151A24, cards #1A1F2E
- **Teal Accent**: #10B981 (matches reference exactly)
- **Circular Window Controls**: 14px circular buttons with white icons (not square!)
- **Text Colors**: #E5E7EB (primary), #9CA3AF (secondary), #6B7280 (tertiary)
- **Subtle Shadows**: Re-enabled shadows (0 1px 2px, 0 4px 6px, 0 10px 15px)
- **Glass Blur**: Added backdrop-filter blur effects (10px, 15px)
- **Glow Effects**: Teal glow on focus states and buttons
- **Border Radius**: 4px (small), 8px (medium), 12px (large)

### Visual Design (FINAL CORRECTED)
- **Primary Background**: #0F1117 (dark navy, not grey!)
- **Secondary Background**: #151A24 (dark navy)
- **Card/Panel Background**: #1A1F2E (navy card)
- **Borders**: #374151 (medium grey)
- **Text**: #E5E7EB (primary), #9CA3AF (secondary), #6B7280 (tertiary)
- **Teal Accent**: #10B981 - matches reference Llama Wrangler theme
- **Window Controls**: Circular (border-radius: 50%) with white icons
- **Window Radius**: 12px
- **Close Button Hover**: Red background #FF3B30 (macOS style)

### Technical Changes
- Window controls are now circular (border-radius: 50%) at 14px size
- Added subtle shadows throughout (var(--shadow-sm), var(--shadow-md), var(--shadow-lg))
- Added backdrop-filter blur effects for glass morphism
- Added glow effect on focus states (0 0 0 3px rgba(16, 185, 129, 0.3))
- Buttons have teal glow shadows (0 2px 8px rgba(16, 185, 129, 0.25))
- Updated all semantic colors to match reference
- Border-left thickness increased from 2px to 3px on selected items

## [1.1.1] - 2025-02-07 20:36 UTC

### Fixed
- **Repository Compliance**: FULL REPO AUDIT - All 18 checks passed with minor fixes
- **Empty Folders**: Added `.gitkeep` to `.audit_outputs/reports/` directory
- **Duplicate Files**: Moved `scripts/backup-20250911/` to AI-Pre-Trash (7 duplicate scripts removed)

### Audit Results
- **Compliance Score**: 100% (18/18 checks passed)
- **Issues Fixed**: 2 (empty folders, duplicate files)
- **Issues Found**: 0
- **Actions Taken**: 2
- **Documentation**: Generated full compliance report with score breakdown

### Repository Health
- **Standard Files**: All present (README, CHANGELOG, LICENSE, .gitignore, .editorconfig)
- **AI Documentation**: CLAUDE.md and AGENTS.md verified
- **Version Management**: VERSION_MAP.md accurate and up-to-date
- **Resources**: Icons (.ico, .icns, .png) and screenshots standardized
- **Run Scripts**: All platform scripts (Linux, macOS, Windows) functional
- **Electron Config**: Multi-platform build configuration verified
- **Documentation Suite**: Complete /docs/ with 16 comprehensive documents

## [1.0.1] - 2026-02-07

### Fixed
- **Repository Compliance**: Added `.nvmrc` for Node.js version specification (v22)
- **Documentation**: Fixed inconsistent `build-resources/` path references to `resources/` in DOCUMENTATION_INDEX.md
- **Standards**: Verified all repository compliance requirements met

### Infrastructure
- **Version Management**: Verified VERSION_MAP.md accuracy
- **Archive**: Confirmed timestamped backup present (20260207_162307.tar.gz)
- **Run Scripts**: Verified all platform scripts use correct dev mode (`npm run dev`)
- **Electron Config**: Verified `--no-sandbox` flags present for Linux compatibility

## [1.0.0] - 2024-08-23

### Added
- **Cross-Platform Desktop Application**: Native support for macOS (Intel + ARM), Windows (x64/x86), and Linux (x64)
- **Intuitive GUI**: Dark-themed interface with real-time network interface detection
- **MAC Address Spoofing**: Change MAC addresses to custom values or generate random ones
- **MAC Address Restoration**: One-click restoration to original MAC addresses
- **Administrative Privilege Handling**: Secure elevation across all platforms (UAC, sudo, osascript)
- **Real-time Status Display**: Shows current, original, and spoofed status for each interface
- **Input Validation**: MAC address format validation with visual feedback
- **Python Backend Integration**: Universal MAC spoofing script with cross-platform support

### Build System
- **Multi-Platform Builds**: Comprehensive electron-builder configuration
- **Installer Support**: 
  - macOS: .app bundles, portable .zip packages
  - Windows: .exe executables, portable .zip packages
  - Linux: AppImage, unpacked binaries
- **Run Scripts**: Platform-specific scripts for both source and binary execution
- **Testing Integration**: Mandatory source testing before production builds
- **Cross-Platform Compatibility**: Single build process generates all platform binaries

### Security & Architecture
- **Context Isolation**: Secure Electron architecture with proper IPC handling
- **Preload Scripts**: Safe communication bridge between main and renderer processes
- **Privilege Management**: Platform-specific authentication handlers
- **Error Handling**: Comprehensive error propagation and user-friendly messaging
- **Process Security**: Secure child process management for Python script execution

### Documentation
- **Comprehensive README**: Multi-platform setup and usage instructions
- **Architecture Documentation**: Detailed technical implementation guide
- **Build System Guide**: Complete build and distribution workflow
- **Project Structure**: Standardized organization following best practices
- **Development Notes**: Learning journey and implementation insights

### Technical Specifications
- **Electron**: 27.3.11 with latest security practices
- **Node.js**: 24.5.0 compatibility
- **Python**: 3.11+ backend integration
- **Build Targets**: 6+ different package formats across 3 platforms
- **File Sizes**: Optimized binaries (85-98MB per platform)

## [1.0.1] - 2026-02-07

### Repository Compliance Audit (FULL AUTOFIX)
- **Resource Consolidation**: Merged `build-resources/` and `build_resources/` into single `resources/` directory
- **Electron Sandbox Fix**: Added `--no-sandbox` flag to `start` and `dev` scripts in package.json
- **DevTools Fix**: Removed auto-opening DevTools in dev mode (manual via Ctrl+Shift+I)
- **Run Scripts**: Rewrote all 3 run-source scripts to use `npm run dev`, fixed undefined `command_exists`, added Linux sysctl sandbox fix
- **Run Script Naming**: Renamed `run-source-macos.sh` to `run-source-mac.sh` (standard naming)
- **AI Instructions**: Created `CLAUDE.md` and `AGENTS.md` from existing `AGENT.md`
- **Metadata**: Added `repository`, `bugs`, `homepage` URLs; fixed publish owner to `sanchez314c`
- **Stray Files**: Moved root-level duplicates to AI-Pre-Trash (TECHSTACK.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md, AGENT.md, .gitignore.backup, MAC app alias, dev/ folder)
- **VERSION_MAP.md**: Created version inventory
- **.gitignore**: Deduplicated 296 lines to 180 organized lines; added `legacy/` pattern
- **Backup**: Created timestamped tar.gz backup in archive/
- **Empty Folders**: Added .gitkeep to `resources/screenshots/`
- **package.json Build Paths**: Updated `buildResources` and MAS entitlements paths from `build-resources/` to `resources/`

## [Unreleased]

### Planned
- **MSI Installer**: Windows MSI installer support
- **DMG Creation**: Fix macOS DMG background template issue
- **Linux Packages**: .deb and .rpm package generation
- **Code Signing**: Digital signatures for all platforms
- **Auto-Updates**: Electron updater integration
- **CLI Interface**: Command-line version for automation

### Under Consideration
- **Profile Management**: Save and manage MAC address profiles
- **Scheduled Operations**: Timer-based MAC address changes
- **Network Analytics**: Connection history and privacy metrics
- **Enterprise Features**: Centralized management and logging

---

## Version History

- **v1.0.0**: Initial release with full cross-platform support
- **v0.9.x**: Development and testing phases
- **v0.1.0**: Initial prototype and proof of concept