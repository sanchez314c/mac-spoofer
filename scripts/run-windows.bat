@echo off
setlocal enabledelayedexpansion

REM Run MAC Address Spoofer from Compiled Binary - Windows  
REM Launches the compiled application from dist folder

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

echo %BLUE%[%TIME%]%NC% Launching compiled MAC Address Spoofer application...

REM Display system information
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
echo %CYAN%[%TIME%] i%NC% Windows version: %VERSION%

REM Check if dist directory exists
if not exist "dist" (
    echo %RED%[%TIME%] X%NC% No dist\ directory found. Please run .\scripts\compile-build-dist.sh first.
    pause
    exit /b 1
)

REM Look for Windows binaries
set EXE_PATH=
set INSTALLER_PATH=
set ZIP_PATH=

REM Look for installer
for /f "tokens=*" %%i in ('dir /b "dist\*.exe" 2^>nul') do (
    if not defined INSTALLER_PATH set INSTALLER_PATH=dist\%%i
    echo %GREEN%[%TIME%] OK%NC% Found installer: %%i
)

REM Look for unpacked executable
if exist "dist\win-unpacked" (
    for /f "tokens=*" %%i in ('dir /b "dist\win-unpacked\*.exe" 2^>nul') do (
        if not defined EXE_PATH set EXE_PATH=dist\win-unpacked\%%i
        echo %GREEN%[%TIME%] OK%NC% Found executable: %%i
    )
)

REM Look for zip package
for /f "tokens=*" %%i in ('dir /b "dist\*win*.zip" 2^>nul') do (
    if not defined ZIP_PATH set ZIP_PATH=dist\%%i
    echo %GREEN%[%TIME%] OK%NC% Found zip package: %%i
)

REM Launch the application
if defined EXE_PATH (
    if exist "%EXE_PATH%" (
        echo %GREEN%[%TIME%] OK%NC% Launching %APP_NAME% from executable...
        echo %CYAN%[%TIME%] i%NC% Starting %EXE_PATH%...
        start "" "%EXE_PATH%"
        echo %GREEN%[%TIME%] OK%NC% Application launched successfully!
        echo %CYAN%[%TIME%] i%NC% The app is now running. Check your taskbar or system tray.
        goto :end
    )
)

if defined INSTALLER_PATH (
    if exist "%INSTALLER_PATH%" (
        echo %YELLOW%[%TIME%] !%NC% No executable found, but installer is available:
        for %%f in ("%INSTALLER_PATH%") do echo %CYAN%[%TIME%] i%NC%   %%~nxf
        echo %CYAN%[%TIME%] i%NC% To install, double-click the installer file or run:
        echo %CYAN%[%TIME%] i%NC%   "%INSTALLER_PATH%"
        echo.
        echo %CYAN%[%TIME%] i%NC% Opening installer now...
        start "" "%INSTALLER_PATH%"
        goto :end
    )
)

if defined ZIP_PATH (
    if exist "%ZIP_PATH%" (
        echo %YELLOW%[%TIME%] !%NC% No executable found, but zip package is available:
        for %%f in ("%ZIP_PATH%") do echo %CYAN%[%TIME%] i%NC%   %%~nxf
        echo %CYAN%[%TIME%] i%NC% Extract the zip file and run the executable inside.
        echo %CYAN%[%TIME%] i%NC% Opening zip location...
        start "" /D "%~dp0\..\dist" .
        goto :end
    )
)

REM No application found
echo %RED%[%TIME%] X%NC% Could not find %APP_NAME% executable for Windows
echo %CYAN%[%TIME%] i%NC% Available files in dist\:
if exist "dist" (
    dir /b "dist\*.exe" "dist\*.zip" "dist\*.msi" 2>nul | findstr . >nul
    if errorlevel 1 (
        echo   No Windows application files found
    ) else (
        dir /b "dist\*.exe" "dist\*.zip" "dist\*.msi" 2>nul
    )
)
echo.
echo %CYAN%[%TIME%] i%NC% To build the app first, run:
echo %CYAN%[%TIME%] i%NC%   .\scripts\compile-build-dist.sh
echo.
echo %CYAN%[%TIME%] i%NC% To run from source instead:
echo %CYAN%[%TIME%] i%NC%   .\scripts\run-windows-source.bat
echo.

:end
pause