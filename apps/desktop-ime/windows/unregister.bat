@echo off
setlocal

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Administrative permissions are required to unregister a TSF Text Service.
    echo Please right-click Command Prompt and select "Run as Administrator".
    pause
    exit /b 1
)

set SCRIPT_DIR=%~dp0
set DLL64=%SCRIPT_DIR%bin\x64\AmharicTSF64.dll
set DLL32=%SCRIPT_DIR%bin\x86\AmharicTSF32.dll

if exist "%DLL64%" (
    echo Unregistering 64-bit Text Service: %DLL64%
    %SystemRoot%\System32\regsvr32.exe /u /s "%DLL64%"
)

if exist "%DLL32%" (
    echo Unregistering 32-bit Text Service: %DLL32%
    %SystemRoot%\SysWOW64\regsvr32.exe /u /s "%DLL32%"
)

echo.
echo [SUCCESS] Amharic Phonetic Keyboard unregistered.
