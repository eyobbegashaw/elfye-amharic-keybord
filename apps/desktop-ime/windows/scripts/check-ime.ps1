$ErrorActionPreference = "Stop"

$clsid = "{792C6287-E8DF-4CA1-82BB-A9250646BF63}"
$profileGuid = "{C8894451-9C4E-4FD7-A0E5-0D5460E58552}"
$langIdHex = "0x0000045E"

$reg64Path = "Registry::HKEY_CLASSES_ROOT\CLSID\$clsid\InprocServer32"
$reg32Path = "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Classes\WOW6432Node\CLSID\$clsid\InprocServer32"
$tipPath   = "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\CTF\TIP\$clsid\LanguageProfile\$langIdHex\$profileGuid"

$dll64Path = $null
$dll32Path = $null
$registered64 = $false
$registered32 = $false
$profileEnabled = $false

if (Test-Path $reg64Path) {
    $val = (Get-ItemProperty -Path $reg64Path -ErrorAction SilentlyContinue).'(default)'
    if ($val -and (Test-Path $val)) {
        $registered64 = $true
        $dll64Path = $val
    }
}

if (Test-Path $reg32Path) {
    $val = (Get-ItemProperty -Path $reg32Path -ErrorAction SilentlyContinue).'(default)'
    if ($val -and (Test-Path $val)) {
        $registered32 = $true
        $dll32Path = $val
    }
}

if (Test-Path $tipPath) {
    $enableVal = (Get-ItemProperty -Path $tipPath -ErrorAction SilentlyContinue).Enable
    if ($enableVal -eq 1) {
        $profileEnabled = $true
    }
}

$inUserLangList = $false
try {
    $langList = Get-WinUserLanguageList
    $tipTag = "045E:$clsid$profileGuid"
    foreach ($lang in $langList) {
        if ($lang.InputMethodTips -contains $tipTag) {
            $inUserLangList = $true
            break
        }
    }
} catch {
    # Ignore if WinUserLanguageList is unavailable
}

$result = @{
    platform       = "win32"
    installed      = ($registered64 -and $profileEnabled)
    registered64   = $registered64
    registered32   = $registered32
    profileEnabled = $profileEnabled
    activeInUser   = $inUserLangList
    dll64Path      = $dll64Path
    dll32Path      = $dll32Path
}

$result | ConvertTo-Json -Compress
