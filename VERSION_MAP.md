# Version Map - MAC Address Spoofer

## Active Version

| Component | Version | Location | Notes |
|-----------|---------|----------|-------|
| Application | **v1.2.3** | repo root | Current production version |
| package.json | 1.0.0 | `package.json` | Needs bump to 1.2.3 |
| Python backend | N/A | `src/universal_mac_spoof.py` | No independent versioning |

## Version History

| Version | Date | Description |
|---------|------|-------------|
| v1.2.3 | 2026-03-14 | Full compliance audit: no-sandbox switch injected into Linux flags block in main.js, ports rotated (DEBUG=62784, INSPECT=50799, DEV=55736), .nvmrc bumped to Node 24, author normalized to J. Michaels, tests/ and legacy/ dirs created, AGENTS.md synced from CLAUDE.md |
| v1.2.2 | 2026-02-08 | Neo-Noir Glass theme hardening — IPC unified to invoke/handle, experimentalFeatures removed, CSS variable orphans fixed, z-index hierarchy corrected |
| v1.2.1 | 2026-02-08 | Transparency flags moved to main.js; random debug ports refreshed; run scripts updated |
| v1.2.0 | 2026-02-08 | Complete Neo-Noir Glass Monitor design system restyle; removed backdrop-filter dependency; new layered shadow and ambient gradient mesh system |
| v1.1.2 | 2026-02-07 | Dark navy theme correction; circular window controls; glass blur effects |
| v1.1.1 | 2026-02-07 | Repository compliance audit (18/18 checks passed); port configuration; launch scripts rewritten |
| v1.0.1 | 2026-02-07 | Repository compliance autofix: resources/ consolidation, sandbox flag, CLAUDE.md/AGENTS.md creation, .gitignore deduplication |
| v1.0.0 | 2024-08-23 | Initial release — cross-platform Electron app with Python backend, multi-platform build system |

## Archive

Timestamped backups stored in `archive/` (gitignored):
- `20260207_162307.tar.gz`
- `20260208_141541.zip`
- `20260210_173535.zip`
- `backup_before_reskin_20260207_212629.tar.gz`
- `pre-neo-noir-glass-20260208_003234.tar.gz`
