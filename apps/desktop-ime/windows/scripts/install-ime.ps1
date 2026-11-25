param(
    [Parameter(Mandatory = $true)]
    [string]$BinDir
)

$ErrorActionPreference = "Stop"

# Verify Administrator privileges
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Administrator privileges are required to install the Windows TSF IME."
    exit 1
}

$src64 = Join-Path $BinDir "x64\AmharicTSF64.dll"
$src32 = Join-Path $BinDir "x86\AmharicTSF32.dll"

if (-not (Test-Path $src64)) {
    Write-Error "64-bit TSF DLL not found at: $src64"
    exit 1
}

$destDir64 = Join-Path $env:ProgramFiles "Elfye"
$destDir32 = Join-Path ${env:ProgramFiles(x86)} "Elfye"
if (-not $destDir32) { $destDir32 = $destDir64 }

New-Item -ItemType Directory -Force -Path $destDir64 | Out-Null
New-Item -ItemType Directory -Force -Path $destDir32 | Out-Null

$dest64 = Join-Path $destDir64 "AmharicTSF64.dll"
$dest32 = Join-Path $destDir32 "AmharicTSF32.dll"

# Unregister previous version if present to release file locks if possible
if (Test-Path $dest64) {
    & "$env:SystemRoot\System32\regsvr32.exe" /u /s "$dest64" | Out-Null
}
if (Test-Path $dest32) {
    & "$env:SystemRoot\SysWOW64\regsvr32.exe" /u /s "$dest32" | Out-Null
}

Copy-Item -Path $src64 -Destination $dest64 -Force
# Grant AppContainer (UWP / Edge / Modern apps) read+execute ACLs
& icacls.exe "$dest64" /grant "*S-1-15-2-1:(RX)" /Q | Out-Null

$reg64 = Start-Process -FilePath "$env:SystemRoot\System32\regsvr32.exe" -ArgumentList "/s `"$dest64`"" -Wait -PassThru
if ($reg64.ExitCode -ne 0) {
    Write-Error "regsvr32 failed for 64-bit DLL (exit code $($reg64.ExitCode))."
    exit 1
}

if (Test-Path $src32) {
    Copy-Item -Path $src32 -Destination $dest32 -Force
    & icacls.exe "$dest32" /grant "*S-1-15-2-1:(RX)" /Q | Out-Null
    $reg32 = Start-Process -FilePath "$env:SystemRoot\SysWOW64\regsvr32.exe" -ArgumentList "/s `"$dest32`"" -Wait -PassThru
    if ($reg32.ExitCode -ne 0) {
        Write-Warning "regsvr32 exited with $($reg32.ExitCode) for 32-bit DLL."
    }
}

# Add am-ET TIP to current user's language list (Win+Space) without overwriting existing languages
try {
    $clsid = "{792C6287-E8DF-4CA1-82BB-A9250646BF63}"
    $profileGuid = "{C8894451-9C4E-4FD7-A0E5-0D5460E58552}"
    $tipTag = "045E:$clsid$profileGuid"

    $langList = Get-WinUserLanguageList
    $amLang = $langList | Where-Object { $_.LanguageTag -eq "am-ET" } | Select-Object -First 1
    if (-not $amLang) {
        $amLang = New-WinUserLanguageList -Language "am-ET" | Select-Object -First 1
        $amLang.InputMethodTips.Clear()
        $amLang.InputMethodTips.Add($tipTag)
        $langList.Add($amLang)
        Set-WinUserLanguageList -LanguageList $langList -Force
    } elseif (-not ($amLang.InputMethodTips -contains $tipTag)) {
        $amLang.InputMethodTips.Add($tipTag)
        Set-WinUserLanguageList -LanguageList $langList -Force
    }
} catch {
    Write-Warning "Could not automatically update WinUserLanguageList: $_"
}

Write-Output "INSTALLED_OK"
