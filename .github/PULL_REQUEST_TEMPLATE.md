## Description

<!-- What does this PR do? One to three sentences. -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactor (no behavior change)
- [ ] Build / CI change

## Testing Done

<!-- Describe what you tested and on which platform(s) -->

**Platform tested:** macOS / Windows / Linux (circle one or list all)

Manual testing checklist:
- [ ] Application launches without errors
- [ ] Network interfaces populate in the sidebar
- [ ] Admin status indicator reflects actual privilege state
- [ ] Random MAC generation produces locally administered addresses (02/06/0A/0E first octet)
- [ ] Custom MAC validation rejects malformed input
- [ ] Spoof operation succeeds with admin rights
- [ ] Restore operation reverts to pre-spoof MAC
- [ ] Toast notifications render correctly
- [ ] Window minimize/maximize/close work via IPC
- [ ] `python3 src/universal_mac_spoof.py --list` produces correct output

## Security Review

- [ ] No `experimentalFeatures: true` added to webPreferences
- [ ] No `nodeIntegration: true` in renderer
- [ ] All new IPC channels use `ipcMain.handle` / `ipcRenderer.invoke` pattern
- [ ] User input validated before passing to Python subprocess
- [ ] No new hardcoded credentials or secrets

## CHANGELOG.md Updated

- [ ] Added entry under `[Unreleased]`

## Screenshots

<!-- If this changes UI, add before/after screenshots -->

## Additional Notes

<!-- Breaking changes, migration steps, anything reviewers should know -->
