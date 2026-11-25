#!/usr/bin/env bash
set -e

# ==============================================================================
# macOS Input Method Uninstaller
# ==============================================================================

DEST_USER="${HOME}/Library/Input Methods/Amharic.app"
DEST_SYS="/Library/Input Methods/Amharic.app"

echo "=== Uninstalling Elfye Amharic Input Method for macOS ==="

pkill -x AmharicInputMethod || true

if [ -d "${DEST_USER}" ]; then
    rm -rf "${DEST_USER}"
    echo "Removed ${DEST_USER}"
fi

if [ "$1" == "--system" ] && [ -d "${DEST_SYS}" ]; then
    rm -rf "${DEST_SYS}"
    echo "Removed ${DEST_SYS}"
fi

echo "UNINSTALLED_OK"
