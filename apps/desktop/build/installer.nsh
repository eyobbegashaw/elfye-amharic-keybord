; Elfye Amharic Keyboard - NSIS Custom Uninstall Cleanup
!macro customUnInstall
  IfFileExists "$INSTDIR\resources\desktop-ime\windows\scripts\uninstall-ime.ps1" 0 +2
    nsExec::ExecToLog 'powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "$INSTDIR\resources\desktop-ime\windows\scripts\uninstall-ime.ps1"'
!macroend
