@echo off
setlocal enabledelayedexpansion

REM Run MAC Address Spoofer from Source - Windows
REM Launches the app directly from source code using npm  
REM MAC Address Spoofer Application - Following Electron Build Standards

REM Set colors
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set CYAN=[96m
set NC=[0m

REM Configuration
set APP_NAME=MAC Address Spoofer

REM Get script directory and navigate to project root
cd /d "%~dp0\.."

echo %BLUE%[%TIME%]%NC% Starting MAC Address Spoofer from source (Windows)...

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%[%TIME%] X%NC% Node.js is not installed. Please install Node.js 16 or higher.
    echo %CYAN%[%TIME%] i%NC% Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%[%TIME%] X%NC% npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check for Python 3
set PYTHON_FOUND=0
where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 set PYTHON_FOUND=1
where python >nul 2>nul  
if %ERRORLEVEL% EQU 0 set PYTHON_FOUND=1

if %PYTHON_FOUND% EQU 0 (
    echo %RED%[%TIME%] X%NC% Python 3 is not installed. Please install Python 3.x.
    echo %CYAN%[%TIME%] i%NC% Download from: https://www.python.org/
    pause
    exit /b 1
)

REM Check for administrator privileges
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo %YELLOW%[%TIME%] !%NC% This application requires administrator privileges for MAC spoofing operations.
    echo %CYAN%[%TIME%] i%NC% You may need to run as Administrator for full functionality.
)

REM Display system information
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

set PYTHON_VERSION=Unknown
where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('python3 --version') do set PYTHON_VERSION=%%i
) else (
    where python >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    )
)

echo %CYAN%[%TIME%] i%NC% Node version: %NODE_VERSION%
echo %CYAN%[%TIME%] i%NC% npm version: %NPM_VERSION%
echo %CYAN%[%TIME%] i%NC% Python version: %PYTHON_VERSION%

REM Check if package.json exists
if not exist "package.json" (
    echo %RED%[%TIME%] X%NC% package.json not found. Make sure you're in the project root directory.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo %BLUE%[%TIME%]%NC% Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo %RED%[%TIME%] X%NC% Failed to install dependencies
        pause
        exit /b 1
    )
    echo %GREEN%[%TIME%] OK%NC% Dependencies installed
) else (
    REM Check if node_modules is empty
    dir /b node_modules 2>nul | findstr . >nul
    if %ERRORLEVEL% NEQ 0 (
        echo %BLUE%[%TIME%]%NC% Installing dependencies...
        call npm install
        if %ERRORLEVEL% NEQ 0 (
            echo %RED%[%TIME%] X%NC% Failed to install dependencies
            pause
            exit /b 1
        )
        echo %GREEN%[%TIME%] OK%NC% Dependencies installed
    ) else (
        echo %CYAN%[%TIME%] i%NC% Dependencies already installed
    )
)

REM Display application information from package.json
where jq >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('jq -r ".version" package.json 2^>nul') do set APP_VERSION=%%i
    if not "!APP_VERSION!"=="null" if not "!APP_VERSION!"=="" (
        echo %CYAN%[%TIME%] i%NC% Application: %APP_NAME% v!APP_VERSION!
    )
)

REM Launch the app from source
echo.
echo %GREEN%==========================================%NC%
echo %GREEN%    MAC Address Spoofer Development      %NC%
echo %GREEN%==========================================%NC%
echo.
echo %BLUE%[%TIME%]%NC% Launching %APP_NAME% from source code...
echo %YELLOW%[%TIME%] !%NC% This will start the app in development mode with admin privilege requirements
echo %CYAN%[%TIME%] i%NC% Press Ctrl+C to stop the application
echo.

REM Run the app in development mode
call npm start

REM Check exit code
set EXIT_CODE=%ERRORLEVEL%
echo.
if %EXIT_CODE% EQU 0 (
    echo %GREEN%[%TIME%] OK%NC% Application session ended successfully
) else (
    echo %RED%[%TIME%] X%NC% Application terminated with error code: %EXIT_CODE%
)

echo.
echo %CYAN%[%TIME%] i%NC% To build for production, run: scripts\compile-build-dist.sh
echo %CYAN%[%TIME%] i%NC% To run compiled binary, use: scripts\run-windows.bat
pause