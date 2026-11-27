#!/usr/bin/env bash
set -e

# ==============================================================================
# macOS Input Method Builder & Installer
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${SCRIPT_DIR}/AmharicInputMethod"
BUILD_DIR="${APP_DIR}/.build/release"
TARGET_APP="${SCRIPT_DIR}/build/Amharic.app"
DEST_DIR="${HOME}/Library/Input Methods"

echo "=== Building Amharic Input Method for macOS ==="

cd "${APP_DIR}"
swift build -c release

echo "=== Creating Amharic.app Bundle ==="
rm -rf "${TARGET_APP}"
mkdir -p "${TARGET_APP}/Contents/MacOS"
mkdir -p "${TARGET_APP}/Contents/Resources"

cp "${BUILD_DIR}/AmharicInputMethod" "${TARGET_APP}/Contents/MacOS/AmharicInputMethod"
cp "${APP_DIR}/Resources/Info.plist" "${TARGET_APP}/Contents/Info.plist"
echo -n "APPLappl" > "${TARGET_APP}/Contents/PkgInfo"

echo "=== Signing Bundle (Ad-hoc) ==="
codesign --force --deep --sign - "${TARGET_APP}"

if [ "$1" == "--install" ] || [ "$1" == "-i" ]; then
    echo "=== Installing to ${DEST_DIR} ==="
    mkdir -p "${DEST_DIR}"
    pkill -x AmharicInputMethod || true
    rm -rf "${DEST_DIR}/Amharic.app"
    cp -R "${TARGET_APP}" "${DEST_DIR}/"
    echo "Installed successfully to ${DEST_DIR}/Amharic.app!"
    echo "Please log out and log back in, or activate under:"
    echo "System Settings -> Keyboard -> Input Sources -> Edit -> '+' -> Amharic (Amharic Phonetic)"
fi
