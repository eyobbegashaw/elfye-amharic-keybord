@echo off
setlocal enabledelayedexpansion

echo ====================================================================
echo  Amharic Phonetic Keyboard (Addiyon Scheme) - Windows TSF Build
echo ====================================================================

:: Locate Visual Studio / Build Tools (prefer vswhere.exe, fallback to known paths)
set VCVARS=
if exist "%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe" (
    for /f "usebackq tokens=*" %%i in (`"%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do (
        if exist "%%i\VC\Auxiliary\Build\vcvarsall.bat" set "VCVARS=%%i\VC\Auxiliary\Build\vcvarsall.bat"
    )
)
if "%VCVARS%"=="" (
    if exist "C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" (
    set "VCVARS=C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\VC\Auxiliary\Build\vcvarsall.bat"
) else if exist "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat" (
    set "VCVARS=C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvarsall.bat"
) else if exist "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\Auxiliary\Build\vcvarsall.bat" (
    set "VCVARS=C:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\Auxiliary\Build\vcvarsall.bat"
) else if exist "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" (
    set "VCVARS=C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvarsall.bat"
    )
)

if "%VCVARS%"=="" (
    echo Error: vcvarsall.bat not found. Please install Visual Studio C++ Build Tools.
    exit /b 1
)

set SCRIPT_DIR=%~dp0
set BIN_DIR=%SCRIPT_DIR%bin
if not exist "%BIN_DIR%\x64" mkdir "%BIN_DIR%\x64"
if not exist "%BIN_DIR%\x86" mkdir "%BIN_DIR%\x86"

echo.
echo [1/3] Building and running C++ test suite (test-vectors.json)...
call "%VCVARS%" x64 >nul 2>&1
cd /d "%SCRIPT_DIR%core"
cl /nologo /std:c++17 /EHsc /utf-8 /O2 /Fe:"%BIN_DIR%\test_vectors.exe" AmharicCore.cpp TestVectors.cpp
if errorlevel 1 (
    echo Error: Failed to compile core test suite.
    exit /b 1
)

"%BIN_DIR%\test_vectors.exe" "%SCRIPT_DIR%..\..\..\test-vectors.json"
if errorlevel 1 (
    echo Error: Core tests failed!
    exit /b 1
)
del "%SCRIPT_DIR%core\*.obj" >nul 2>&1

echo.
echo [2/3] Building 64-bit TSF DLL (AmharicTSF64.dll)...
cd /d "%SCRIPT_DIR%tsf"
cl /nologo /std:c++17 /EHsc /utf-8 /O2 /LD /Fe:"%BIN_DIR%\x64\AmharicTSF64.dll" Globals.cpp ClassFactory.cpp Register.cpp TextService.cpp Composition.cpp KeyEventSink.cpp DllMain.cpp ..\core\AmharicCore.cpp /link /DEF:AmharicTSF.def ole32.lib user32.lib advapi32.lib
if errorlevel 1 (
    echo Error: Failed to build 64-bit DLL.
    exit /b 1
)
del "%SCRIPT_DIR%tsf\*.obj" >nul 2>&1

echo.
echo [3/3] Building 32-bit TSF DLL (AmharicTSF32.dll)...
call "%VCVARS%" x86 >nul 2>&1
cd /d "%SCRIPT_DIR%tsf"
cl /nologo /std:c++17 /EHsc /utf-8 /O2 /LD /Fe:"%BIN_DIR%\x86\AmharicTSF32.dll" Globals.cpp ClassFactory.cpp Register.cpp TextService.cpp Composition.cpp KeyEventSink.cpp DllMain.cpp ..\core\AmharicCore.cpp /link /DEF:AmharicTSF.def ole32.lib user32.lib advapi32.lib
if errorlevel 1 (
    echo Error: Failed to build 32-bit DLL.
    exit /b 1
)
del "%SCRIPT_DIR%tsf\*.obj" >nul 2>&1

echo.
echo ====================================================================
echo  BUILD SUCCEEDED!
echo  Binaries created:
echo    - %BIN_DIR%\test_vectors.exe
echo    - %BIN_DIR%\x64\AmharicTSF64.dll
echo    - %BIN_DIR%\x86\AmharicTSF32.dll
echo.
echo  To register for testing (Administrator required):
echo    call register.bat
echo ====================================================================
cd /d "%SCRIPT_DIR%"
