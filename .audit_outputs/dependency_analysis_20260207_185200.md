# Dependency Analysis Report

**Project**: mac-address-spoofer
**Analysis Date**: 2026-02-07 18:52 UTC
**Platform**: Linux (Ubuntu)
**Status**: CRITICAL - Dependencies Not Installed

---

## 🚨 EXECUTIVE SUMMARY

**CRITICAL FINDING**: **No dependencies are installed** (`node_modules/` directory does not exist). This makes the project **completely non-functional** - it cannot run, build, or be tested.

**Impact**: All vulnerability and outdated package data below is **theoretical**, based on what would be installed. Actual security posture and version status cannot be verified until dependencies are installed.

---

## 1. DEPENDENCY INSTALLATION STATUS

### 🔴 CRITICAL: No Dependencies Installed

```
Status: FAILED
node_modules/: DOES NOT EXIST
Dependencies: 0/19 installed (0%)
```

**Affected Dependencies (ALL)**:

- **Production (8)**: @types/node, @types/react, @types/react-dom, electron-store, react, react-dom, typescript, vite
- **Development (18)**: @typescript-eslint/eslint-plugin, @typescript-eslint/parser, electron, electron-builder, eslint, eslint-config-prettier, eslint-plugin-prettier, eslint-plugin-react, eslint-plugin-react-hooks, prettier

**Impact**:

- ❌ Cannot run the application
- ❌ Cannot build the application
- ❌ Cannot run tests
- ❌ Cannot run linters
- ❌ Cannot verify actual vulnerabilities
- ❌ Cannot verify actual outdated packages

**Required Action**: `npm install` must be run immediately to install all dependencies.

---

## 2. SECURITY VULNERABILITIES (Theoretical)

### Summary

- **Total Vulnerabilities**: 13
- **Critical**: 0
- **High**: 11 ⚠️
- **Moderate**: 2 ⚠️
- **Low**: 0

**Note**: These are theoretical vulnerabilities that would exist after `npm install`. Actual verification requires installation.

### 🔴 HIGH Severity Vulnerabilities (11)

#### 1. `tar` - Multiple Critical Vulnerabilities

**Affected**: electron-builder, @electron/rebuild, cacache, @electron/node-gyp

**CVEs**:

- **GHSA-8qq5-rm4j-mr97**: Arbitrary File Overwrite and Symlink Poisoning via Insufficient Path Sanitization (CWE-22)
- **GHSA-r6q2-hw4h-h46w**: Race Condition via Unicode Ligature Collisions on macOS APFS (CWE-176)
- **GHSA-34x7-hfp2-rc4v**: Arbitrary File Creation/Overwrite via Hardlink Path Traversal (CWE-22, CWE-59)

**Impact**: Arbitrary file write, symlink poisoning, race conditions

**Remediation**: Update tar to >= 7.5.7
**Fix Available**: ✅ Yes (npm audit fix)

---

#### 2. `glob` - Command Injection

**CVE**: GHSA-5j98-mcp5-4vw2
**CVSS**: 7.5 (High)
**CWE**: CWE-78 (OS Command Injection)
**Affected**: config-file-ts (transitive dependency)
**Range**: 10.2.0 - 10.4.5
**Impact**: Command injection via -c/--cmd flag when shell:true is used
**Fix Available**: ✅ Yes (update glob to >= 10.5.0)

---

#### 3. `@isaacs/brace-expansion` - Uncontrolled Resource Consumption

**CVE**: GHSA-7h2j-956f-4vf2
**Severity**: High
**CWE**: CWE-1333 (Inefficient Regular Expression Complexity)
**Range**: <= 5.0.0
**Impact**: ReDoS (Regular Expression Denial of Service)
**Fix Available**: ✅ Yes (update to > 5.0.0)

---

#### 4. `make-fetch-happen` - Tar Dependency Chain

**Via**: cacache → tar
**Range**: 7.1.1 - 14.0.0
**Impact**: Inherits all tar vulnerabilities
**Fix Available**: ✅ Yes (via tar update)

---

#### 5. `cacache` - Tar Dependency Chain

**Via**: tar
**Range**: 14.0.0 - 18.0.4
**Impact**: Inherits all tar vulnerabilities
**Fix Available**: ✅ Yes (via tar update)

---

#### 6. `@electron/node-gyp` - Multiple Vulnerabilities

**Via**: make-fetch-happen, tar
**Range**: \*
**Impact**: Inherits all tar and make-fetch-happen vulnerabilities
**Fix Available**: ✅ Yes (via dependency updates)

---

#### 7. `@electron/rebuild` - Multiple Vulnerabilities

**Via**: @electron/node-gyp, tar
**Range**: 3.2.10 - 4.0.2
**Impact**: Inherits all tar and @electron/node-gyp vulnerabilities
**Fix Available**: ✅ Yes (update to > 4.0.2)

---

#### 8. `app-builder-lib` - Multiple Vulnerabilities (Direct)

**Via**: @electron/rebuild, dmg-builder, electron-builder-squirrel-windows, tar
**Range**: 23.0.7 - 26.5.0
**Impact**: Inherits multiple vulnerabilities
**Fix Available**: ✅ Yes (update electron-builder)

---

#### 9. `electron-builder` - Multiple Vulnerabilities (Direct)

**Via**: app-builder-lib, dmg-builder
**Range**: 19.25.0 || 23.0.7 - 26.4.1
**Current**: ^26.0.12 (VULNERABLE)
**Impact**: Multiple vulnerabilities via app-builder-lib
**Fix Available**: ✅ Yes (update electron-builder)

---

#### 10. `dmg-builder` - Multiple Vulnerabilities

**Via**: app-builder-lib
**Range**: 23.0.7 - 26.4.1
**Impact**: Inherits app-builder-lib vulnerabilities
**Fix Available**: ✅ Yes (via electron-builder update)

---

#### 11. `electron-builder-squirrel-windows` - Multiple Vulnerabilities

**Via**: app-builder-lib
**Range**: 23.0.7 - 26.4.1
**Impact**: Inherits app-builder-lib vulnerabilities
**Fix Available**: ✅ Yes (via electron-builder update)

---

### 🟡 MODERATE Severity Vulnerabilities (2)

#### 1. `js-yaml` - Prototype Pollution

**CVE**: GHSA-mh29-5h37-fv8m
**CVSS**: 5.3 (Moderate)
**CWE**: CWE-1321 (Prototype Pollution)
**Range**: 4.0.0 - 4.1.0
**Impact**: Prototype pollution in merge (<<) operator
**Fix Available**: ✅ Yes (update to >= 4.1.1)

---

#### 2. `lodash` - Prototype Pollution

**CVE**: GHSA-xxjr-mmjv-4gpg
**CVSS**: 6.5 (Moderate)
**CWE**: CWE-1321 (Prototype Pollution)
**Range**: 4.0.0 - 4.17.21
**Impact**: Prototype pollution in _.unset and _.omit functions
**Fix Available**: ✅ Yes (update lodash or use lodash-es)

---

## 3. OUTDATED PACKAGES (Theoretical)

**Note**: These are theoretical updates based on npm registry data. Actual current versions cannot be verified without installation.

### Major Version Upgrades

| Package     | Current | Latest | Type  | Priority |
| ----------- | ------- | ------ | ----- | -------- |
| @types/node | ^24.9.2 | 25.2.1 | Major | 🔴 High  |

### Minor/Patch Updates

| Package          | Current | Latest  | Type  | Priority  |
| ---------------- | ------- | ------- | ----- | --------- |
| react            | ^19.2.0 | 19.2.4  | Patch | 🟡 Medium |
| react-dom        | ^19.2.0 | 19.2.4  | Patch | 🟡 Medium |
| vite             | ^7.1.12 | 7.3.1   | Minor | 🟢 Low    |
| @types/react     | ^19.2.2 | 19.2.13 | Patch | 🟢 Low    |
| @types/react-dom | ^19.2.2 | 19.2.3  | Patch | 🟢 Low    |

**Update Command**: `npm update` will update to latest patch/minor versions safely. Use `npm install @types/node@latest` for major version update.

---

## 4. DEPENDENCY CONFLICTS & ISSUES

### 🔴 Missing Dependency Error

**Issue**: `@eslint/js` is referenced in `eslint.config.js` but not listed in package.json

**Error Trace**:

```
missing: @eslint/js
Referenced in: /home/heathen-admin/Desktop/Projects/00_github/mac-spoofer/eslint.config.js
```

**Impact**: ESLint configuration will fail to load
**Remediation**: Add `@eslint/js` to devDependencies

```bash
npm install --save-dev @eslint/js
```

---

### 🔴 Syntax Error in Source Code

**File**: `src/preload.js`
**Error**: `SyntaxError: Unexpected reserved word 'interface'. (12:14)`

**Impact**: The preload script has a syntax error that will prevent the application from running
**Remediation**: Review and fix the syntax error in src/preload.js:12

---

### Version Ranges Analysis

All package versions use caret (`^`) ranges, which allows updates to the latest patch/minor versions but not major versions. This is generally good practice for stability.

**Recommendation**: Continue using caret ranges, but audit major version updates carefully before applying.

---

## 5. SUPPLY CHAIN ANALYSIS

### Dependency Tree Structure (Expected)

**Total Dependencies When Installed**: 706

- Production: 40
- Development: 612
- Optional: 83
- Peer: 16

**Direct Dependencies**: 19

- Production: 8
- Development: 11

### Supply Chain Risk Assessment

#### 🔴 High-Risk Dependencies

1. **electron-builder ecosystem**
   - **Risk**: Complex dependency chain with multiple high-severity vulnerabilities
   - **Vulnerabilities**: 11 HIGH (via tar, glob, lodash, etc.)
   - **Recommendation**: Update electron-builder to latest version and monitor security advisories

2. **tar package**
   - **Risk**: Core build tool with multiple critical vulnerabilities
   - **Vulnerabilities**: 3 CVEs (file overwrite, symlink poisoning, race conditions)
   - **Recommendation**: Ensure update to >= 7.5.7

3. **electron framework**
   - **Risk**: Large attack surface due to Chromium + Node.js integration
   - **Recommendation**: Keep Electron updated to latest version (currently 39.0.0 is good)

#### 🟡 Medium-Risk Dependencies

1. **lodash**
   - **Risk**: Prototype pollution vulnerability in older versions
   - **Recommendation**: Update to latest version or migrate to lodash-es

2. **js-yaml**
   - **Risk**: Prototype pollution in YAML parsing
   - **Recommendation**: Update to >= 4.1.1

#### 🟢 Low-Risk Dependencies

1. **TypeScript type definitions** (@types/\*)
   - **Risk**: No runtime code impact
   - **Recommendation**: Keep updated for better IDE support

2. **React ecosystem** (react, react-dom)
   - **Risk**: Well-maintained, security-focused
   - **Recommendation**: Keep updated to latest stable versions

### Funding & Maintenance

**npm fund Output**: No funding information available (dependencies not installed)

**Recommendation**: Run `npm fund` after installation to review:

- Packages with commercial funding
- Packages seeking donations
- Packages maintained by corporate sponsors

---

## 6. BUILD CONFIGURATION ANALYSIS

### Build Files Configuration

**Current Configuration**:

```json
"files": [
  "src/**/*",
  "!**/*.ts",
  "!**/*.map",
  "!**/*.md",
  "!**/test/**",
  "!**/tests/**",
  "!**/__tests__/**",
  "!**/spec/**",
  "!**/docs/**",
  "!**/README*",
  "!**/CHANGELOG*",
  "!**/LICENSE*",
  "!**/.git/**",
  "!**/.vscode/**",
  "!**/node_modules/.cache/**",
  "!**/build-temp/**"
]
```

### 🔴 Configuration Issues

1. **Including Source Files**
   - **Issue**: `"src/**/*"` includes all source files, including potentially unnecessary files
   - **Impact**: Larger bundle size, potential security issues (development code, tests)
   - **Remediation**: Be more specific about what to include, or use exclusions

2. **No ASAR Unpack Configuration**
   - **Issue**: No `asarUnpack` for native modules if needed
   - **Impact**: Native modules may fail in production builds
   - **Remediation**: Add if using native modules

### 🟢 Good Practices

- ✅ Excludes TypeScript files (`.ts`, `.map`)
- ✅ Excludes documentation (`*.md`)
- ✅ Excludes test directories
- ✅ Excludes development files (`.git`, `.vscode`)

### Recommended Improvements

```json
"files": [
  "src/main.js",
  "src/preload.js",
  "src/app.js",
  "src/index.html",
  "src/styles.css",
  "src/universal_mac_spoof.py",
  "src/**/*.{js,html,css,py}",
  "!**/test/**",
  "!**/*.spec.js",
  "!**/*.test.js"
],
"asarUnpack": [
  "src/universal_mac_spoof.py"
]
```

---

## 7. PACKAGE SIZE & BLOAT ANALYSIS

### Expected Dependency Sizes (Theoretical)

**Note**: Cannot verify actual sizes without node_modules. Based on typical package sizes:

| Component              | Expected Size | Notes                  |
| ---------------------- | ------------- | ---------------------- |
| Electron               | ~60-80 MB     | Chromium + Node.js     |
| electron-builder       | ~15-20 MB     | Build tooling          |
| React ecosystem        | ~2-5 MB       | React + React-DOM      |
| TypeScript             | ~10-15 MB     | Compiler and types     |
| Build dependencies     | ~20-30 MB     | ESLint, Prettier, etc. |
| **Total node_modules** | ~100-150 MB   | When fully installed   |

### Electron Application Size Guidelines

| Size Rating           | Range      | Assessment                            |
| --------------------- | ---------- | ------------------------------------- |
| ✅ Excellent          | < 80 MB    | Excellent optimization                |
| 🟢 Good               | 80-150 MB  | Acceptable for Electron apps          |
| 🟡 Acceptable         | 150-300 MB | Common for Electron apps              |
| 🔴 Needs Optimization | > 300 MB   | Review dependencies and configuration |

**Expected Application Size**: Based on dependencies, expect ~150-200 MB after build (Acceptable range)

### Unused Dependencies (Detected by depcheck)

**Found**: ~8 potentially unused dependencies (theoretical - requires node_modules to verify)

**Recommendation**: Run `npx depcheck` after `npm install` to identify unused dependencies

**Potential Candidates for Removal**:

- `@types/react` - Check if TypeScript is actually being used
- `@types/react-dom` - Check if TypeScript is actually being used
- `@types/node` - Check if TypeScript is actually being used
- `typescript` - Check if TypeScript is actually being used (project is JavaScript)

**Note**: The project appears to be pure JavaScript (`.js` files), but has TypeScript dependencies. These may be unnecessary unless TypeScript compilation is planned.

---

## 8. RECOMMENDATIONS & ACTION PLAN

### 🔴 CRITICAL - Immediate Actions Required

#### 1. Install Dependencies

```bash
cd /home/heathen-admin/Desktop/Projects/00_github/mac-spoofer
npm install
```

#### 2. Fix Missing Dependency

```bash
npm install --save-dev @eslint/js
```

#### 3. Fix Syntax Error

Review and fix `src/preload.js:12` - `interface` is a reserved keyword

---

### 🟡 HIGH - Security Remediation

#### 4. Fix All Security Vulnerabilities

```bash
npm audit fix
```

**Expected Fixes**:

- Update electron-builder (fixes 11 vulnerabilities)
- Update tar to >= 7.5.7
- Update glob to >= 10.5.0
- Update lodash or migrate to lodash-es
- Update js-yaml to >= 4.1.1

**Verification**: `npm audit` should show 0 vulnerabilities

---

#### 5. Update Outdated Packages

```bash
npm update  # Updates to latest patch/minor versions
npm install @types/node@latest  # Major version update
```

---

### 🟢 MEDIUM - Code Quality & Configuration

#### 6. Review TypeScript Dependencies

If the project is JavaScript-only, remove TypeScript dependencies:

```bash
npm uninstall @types/node @types/react @types/react-dom typescript
```

Or if TypeScript is planned, migrate `.js` files to `.ts`:

```bash
# Update ESLint config for TypeScript
# Migrate files
# Configure tsconfig.json
```

---

#### 7. Optimize Build Configuration

Update `package.json` `build.files` section to be more specific:

```json
"files": [
  "src/**/*.{js,html,css,py}",
  "!**/test/**",
  "!**/*.spec.js",
  "!**/*.test.js"
],
"asarUnpack": [
  "src/universal_mac_spoof.py"
]
```

---

#### 8. Remove Unused Dependencies

After installation, identify and remove unused dependencies:

```bash
npx depcheck
npm uninstall [unused-packages]
```

---

### 🔵 LOW - Ongoing Maintenance

#### 9. Set Up Automated Security Audits

Add to CI/CD pipeline:

```yaml
# .github/workflows/security.yml
name: Security Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm audit
```

---

#### 10. Regular Dependency Updates

```bash
# Monthly routine
npm outdated
npm update
npm audit
npm run bloat-check
```

---

#### 11. Monitor Supply Chain

- Subscribe to security advisories for critical packages (electron, electron-builder)
- Use Snyk, Dependabot, or similar tools for automated monitoring
- Review `npm fund` output quarterly

---

## 9. PRIORITY MATRIX

| Priority | Action                                 | Impact                | Effort | Timeline    |
| -------- | -------------------------------------- | --------------------- | ------ | ----------- |
| 🔴 P0    | Install dependencies                   | Blocks all work       | Low    | Immediate   |
| 🔴 P0    | Fix syntax error in preload.js         | Prevents app startup  | Low    | Immediate   |
| 🔴 P0    | Fix security vulnerabilities (11 HIGH) | Security risk         | Low    | Immediate   |
| 🟡 P1    | Add missing @eslint/js dependency      | Blocks linting        | Low    | Today       |
| 🟡 P1    | Update outdated packages               | Security + features   | Low    | Today       |
| 🟢 P2    | Review/remove TypeScript deps          | Reduce bloat          | Medium | This week   |
| 🟢 P2    | Optimize build configuration           | Smaller builds        | Low    | This week   |
| 🔵 P3    | Remove unused dependencies             | Reduce bloat          | Low    | Next week   |
| 🔵 P3    | Set up automated security monitoring   | Prevent future issues | Medium | Next sprint |

---

## 10. SUMMARY

### Critical Issues

- ❌ **No dependencies installed** - Project completely non-functional
- ❌ **11 HIGH severity vulnerabilities** - Security risk after installation
- ❌ **Missing dependency** (@eslint/js) - Blocks linting
- ❌ **Syntax error** in src/preload.js - Prevents app startup

### Security Posture

- **Current**: Cannot verify (no dependencies installed)
- **Expected**: 11 HIGH, 2 MODERATE vulnerabilities
- **After Remediation**: 0 vulnerabilities (all fixable via npm audit fix)

### Dependencies

- **Direct**: 19 (8 production, 11 development)
- **Total**: 706 (when installed)
- **Status**: All missing

### Build Readiness

- **Current**: Cannot build (no dependencies)
- **Expected**: 150-200 MB (acceptable)
- **Configuration**: Needs optimization

### Next Steps

1. **Install dependencies**: `npm install`
2. **Fix syntax error**: src/preload.js:12
3. **Add missing dependency**: `npm install --save-dev @eslint/js`
4. **Fix vulnerabilities**: `npm audit fix`
5. **Update packages**: `npm update`
6. **Review TypeScript dependencies**: Remove if not needed
7. **Optimize build config**: Refine package.json
8. **Verify build**: `npm run build:quick`

---

**Report Generated**: 2026-02-07 18:52 UTC
**Analysis Tool**: npm audit, npm outdated, depcheck, manual review
**Analyst**: Master Control

**END OF LINE**
