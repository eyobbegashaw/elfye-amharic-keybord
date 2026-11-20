#!/usr/bin/env bash
set -e

# ==============================================================================
# IBus Amharic Phonetic Engine Installer
# ==============================================================================

MODE="user"
if [ "$1" == "--system" ] || [ "$EUID" -eq 0 ]; then
    MODE="system"
fi

echo "=== Installing IBus Amharic Engine (Mode: $MODE) ==="

# Check build dependencies
if ! command -v gcc &> /dev/null; then
    echo "Error: gcc is required to build ibus-amharic."
    exit 1
fi
if ! command -v pkg-config &> /dev/null; then
    echo "Warning: pkg-config not found, using default IBus include paths."
fi

# Build
make all

if [ "$MODE" == "system" ]; then
    echo "Installing system-wide (/usr/libexec and /usr/share/ibus/component)..."
    make install
else
    echo "Installing for current user (~/.local/libexec and ~/.local/share/ibus/component)..."
    make install-user
fi

# Restart IBus daemon if running
if pgrep -x "ibus-daemon" > /dev/null; then
    echo "Restarting ibus-daemon..."
    ibus restart || true
fi

echo ""
echo "=== Installation Complete! ==="
echo "To add the keyboard layout:"
echo "1. GNOME (Ubuntu / Fedora / Debian):"
echo "   Settings -> Keyboard -> Input Sources -> '+'"
echo "   Select 'Amharic' -> 'Amharic (Addiyon Phonetic)'"
echo ""
echo "2. KDE Plasma:"
echo "   System Settings -> Input Devices -> Virtual Keyboard (select IBus)"
echo ""
echo "3. Toggle shortcut: Ctrl + Space (or Super + Space to cycle engines)"
