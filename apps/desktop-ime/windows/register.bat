@echo off
setlocal

:: Check for administrative permissions
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Administrative permissions are required to register a TSF Text Service.
    echo Please right-click Command Prompt and select "Run as Administrator".
    pause
    exit /b 1
)

set SCRIPT_DIR=%~dp0
set DLL64=%SCRIPT_DIR%bin\x64\AmharicTSF64.dll
set DLL32=%SCRIPT_DIR%bin\x86\AmharicTSF32.dll

if not exist "%DLL64%" (
    echo [ERROR] %DLL64% not found. Please run build.bat first.
    exit /b 1
)

echo Registering 64-bit Text Service: %DLL64%
%SystemRoot%\System32\regsvr32.exe /s "%DLL64%"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to register 64-bit DLL.
    exit /b 1
)

if exist "%DLL32%" (
    echo Registering 32-bit Text Service: %DLL32%
    %SystemRoot%\SysWOW64\regsvr32.exe /s "%DLL32%"
    if %errorlevel% neq 0 (
        echo [WARNING] Failed to register 32-bit DLL with SysWOW64 regsvr32.
    )
)

echo.
echo [SUCCESS] Amharic Phonetic Keyboard (Addiyon) registered successfully!
echo You can now switch to "Amharic Phonetic Keyboard" via the Windows Language Bar (Win+Space).
