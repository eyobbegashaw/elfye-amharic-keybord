#!/usr/bin/env bash
set -e

USER_BUNDLE="${HOME}/Library/Input Methods/Amharic.app"
SYS_BUNDLE="/Library/Input Methods/Amharic.app"

installed=false
bundle_path="null"
process_running=false
active_in_tis=false

if [ -d "${USER_BUNDLE}" ]; then
    installed=true
    bundle_path="\"${USER_BUNDLE}\""
elif [ -d "${SYS_BUNDLE}" ]; then
    installed=true
    bundle_path="\"${SYS_BUNDLE}\""
fi

if pgrep -x "AmharicInputMethod" > /dev/null 2>&1; then
    process_running=true
fi

if defaults read com.apple.HIToolbox AppleEnabledInputSources 2>/dev/null | grep -q "com.amharic.inputmethod.Amharic"; then
    active_in_tis=true
fi

printf '{"platform":"macos","installed":%s,"bundlePath":%s,"processRunning":%s,"activeInUser":%s}\n' \
    "$installed" "$bundle_path" "$process_running" "$active_in_tis"
