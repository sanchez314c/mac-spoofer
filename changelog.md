# Changelog — MAC Address Spoofer

## 2026-03-14 — Neo-Noir Glass Monitor Restyle (Complete)

**Neo-Noir Glass Monitor design system fully applied.**

### Title Bar
- App name now renders in teal (`--accent-teal`) per spec
- Added tagline "network identity tool" in muted text, separated by subtle border
- Added flat About (ⓘ) and Settings (⚙) icon buttons with 2px gap, 10px margin before window controls
- Buttons use no circular background at rest, teal-dim bg on hover (flat icon style per spec)
- Window controls remain circular 28px, close hover = red #ef4444, all IPC-wired

### About Modal (new)
- Full in-app custom modal replacing the OS native dialog
- Dark overlay `rgba(10,11,14,0.94)` with `backdrop-filter: blur(12px)`
- Centered modal: gradient bg, glass border `rgba(255,255,255,0.05)`, layered shadow, `::before` inner highlight
- App icon 40px in teal-dim square container (64px)
- App name bold, version in teal monospace
- Description, MIT License | Jason Paul Michaels, email
- GitHub pill badge (teal gradient, glow shadow), links to https://github.com/sanchez314c/mac-spoofer
- Close X (red hover), closes on X / overlay click / Escape key
- Wired to title bar About button and legacy `showAboutDialog()` method

### Status Bar (new, 28px)
- Left: animated green dot, "Status: Ready", separator, interface count
- Right: `v1.0.0` in teal monospace only (no app name repeated)
- Updates dynamically when interfaces load via `updateStatusBar(count)`
- Dot goes offline state (grey, no glow) when 0 interfaces found

### CSS Token Cleanup
- Removed duplicate `.app-title` color declaration (color now set once via teal override block)
- All new components use CSS variable tokens exclusively
- No hardcoded colors beyond design-system-intended inline rgba gradient mesh values
