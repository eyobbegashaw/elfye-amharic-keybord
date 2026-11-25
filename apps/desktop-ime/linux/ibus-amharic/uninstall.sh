#!/usr/bin/env bash
set -e

# ==============================================================================
# IBus Amharic Phonetic Engine Uninstaller
# ==============================================================================

MODE="user"
if [ "$1" == "--system" ] || [ "$EUID" -eq 0 ]; then
    MODE="system"
fi

echo "=== Uninstalling IBus Amharic Engine (Mode: $MODE) ==="

if [ "$MODE" == "system" ]; then
    rm -f /usr/libexec/ibus-engine-amharic
    rm -f /usr/share/ibus/component/amharic.xml
else
    rm -f "${HOME}/.local/libexec/ibus-engine-amharic"
    rm -f "${HOME}/.local/share/ibus/component/amharic.xml"
fi

# Restart IBus daemon if running
if pgrep -x "ibus-daemon" > /dev/null; then
    echo "Restarting ibus-daemon..."
    ibus restart || true
fi

echo "UNINSTALLED_OK"
