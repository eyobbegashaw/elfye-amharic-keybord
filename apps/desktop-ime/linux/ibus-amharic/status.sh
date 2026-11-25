#!/usr/bin/env bash
set -e

USER_BIN="${HOME}/.local/libexec/ibus-engine-amharic"
USER_XML="${HOME}/.local/share/ibus/component/amharic.xml"
SYS_BIN="/usr/libexec/ibus-engine-amharic"
SYS_XML="/usr/share/ibus/component/amharic.xml"

user_installed=false
system_installed=false
ibus_running=false
engine_registered=false
active_in_gnome=false

if [ -x "$USER_BIN" ] && [ -f "$USER_XML" ]; then
    user_installed=true
fi

if [ -x "$SYS_BIN" ] && [ -f "$SYS_XML" ]; then
    system_installed=true
fi

if pgrep -x "ibus-daemon" > /dev/null 2>&1; then
    ibus_running=true
fi

if command -v ibus > /dev/null 2>&1; then
    if ibus list-engine 2>/dev/null | grep -q "amharic-phonetic"; then
        engine_registered=true
    fi
fi

if command -v gsettings > /dev/null 2>&1; then
    if gsettings get org.gnome.desktop.input-sources sources 2>/dev/null | grep -q "amharic-phonetic"; then
        active_in_gnome=true
    fi
fi

installed=false
if [ "$user_installed" = true ] || [ "$system_installed" = true ]; then
    installed=true
fi

printf '{"platform":"linux","installed":%s,"userInstalled":%s,"systemInstalled":%s,"ibusRunning":%s,"engineRegistered":%s,"activeInUser":%s}\n' \
    "$installed" "$user_installed" "$system_installed" "$ibus_running" "$engine_registered" "$active_in_gnome"
