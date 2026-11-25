$ErrorActionPreference = "Stop"

# Verify Administrator privileges
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Administrator privileges are required to uninstall the Windows TSF IME."
    exit 1
}

$clsid = "{792C6287-E8DF-4CA1-82BB-A9250646BF63}"
$profileGuid = "{C8894451-9C4E-4FD7-A0E5-0D5460E58552}"
$tipTag = "045E:$clsid$profileGuid"

# Remove TIP from WinUserLanguageList cleanly
try {
    $langList = Get-WinUserLanguageList
    $modified = $false
    foreach ($lang in $langList) {
        if ($lang.InputMethodTips -contains $tipTag) {
            $null = $lang.InputMethodTips.Remove($tipTag)
            $modified = $true
        }
    }
    if ($modified) {
        # Remove empty am-ET entry only if it has no remaining input tips
        $filtered = $langList | Where-Object { -not ($_.LanguageTag -eq "am-ET" -and $_.InputMethodTips.Count -eq 0) }
        if ($filtered.Count -gt 0) {
            Set-WinUserLanguageList -LanguageList $filtered -Force
        }
    }
} catch {
    Write-Warning "Could not update WinUserLanguageList: $_"
}

$dest64 = Join-Path $env:ProgramFiles "Elfye\AmharicTSF64.dll"
$dest32 = Join-Path ${env:ProgramFiles(x86)} "Elfye\AmharicTSF32.dll"

if (Test-Path $dest64) {
    Start-Process -FilePath "$env:SystemRoot\System32\regsvr32.exe" -ArgumentList "/u /s `"$dest64`"" -Wait | Out-Null
    Remove-Item -Path $dest64 -Force -ErrorAction SilentlyContinue
}

if (Test-Path $dest32) {
    Start-Process -FilePath "$env:SystemRoot\SysWOW64\regsvr32.exe" -ArgumentList "/u /s `"$dest32`"" -Wait | Out-Null
    Remove-Item -Path $dest32 -Force -ErrorAction SilentlyContinue
}

Write-Output "UNINSTALLED_OK"
