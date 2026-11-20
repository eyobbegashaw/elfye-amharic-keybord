# IBus Amharic Phonetic Input Method (`ibus-amharic`)

Native system-wide Linux input method engine for IBus implementing the **Addiyon Keyboard scheme**.

---

## 1. Language Choice Justification (C vs. Rust)

**Choice: C (with zero external dependencies for `amharic_core`)**

- **Why C for IBus**: `libibus-1.0` is fundamentally a GObject/GLib C library deeply tied to GIO and D-Bus IPC. Existing Rust bindings for IBus (`ibus-sys`) are incomplete, unmaintained across recent GNOME/Fedora/Debian releases, and frequently suffer from ABI mismatches across varying GObject versions.
- **Portability & Build Simplicity**: Writing the core transliteration engine in clean C11 guarantees that it compiles natively on any Linux distribution with `gcc` or `clang`, without requiring `cargo`, `rustc`, or multi-gigabyte build toolchains.
- **Reliability**: Matches the standard architecture of official IBus engines (`ibus-libpinyin`, `ibus-table`, `ibus-anthy`, `ibus-m17n`).

---

## 2. Directory Structure

```
ibus-amharic/
 ├── core/
 │    ├── amharic_core.h       # Public C header (TransliterationOptions, LiveTypingEngine)
 │    ├── amharic_core.c       # Core transliteration & stateful buffer logic
 │    └── test_vectors.c       # Standalone test runner running test-vectors.json
 ├── src/
 │    ├── engine.h             # GObject IBusAmharicEngine declaration
 │    ├── engine.c             # Preedit text, commit, progressive backspace, hotkey toggle
 │    └── main.c               # IBus daemon entry point & component registration
 ├── data/
 │    └── amharic.xml.in       # IBus component descriptor
 ├── Makefile                  # Build, test, and install automation
 ├── install.sh                # User-level and system-wide installer script
 └── README.md
```

---

## 3. Build & Test Instructions

### Prerequisites
On Debian/Ubuntu:
```bash
sudo apt-get install -y gcc make libibus-1.0-dev libglib2.0-dev
```
On Fedora:
```bash
sudo dnf install -y gcc make ibus-devel glib2-devel
```
On Arch Linux:
```bash
sudo pacman -S gcc make ibus glib2
```

### Build Everything
```bash
make all
```

### Run Unit Tests (`test-vectors.json`)
```bash
make test
# or manually:
./build/test_vectors ../../../../test-vectors.json
```
This runs:
1. All 104 full transliteration test vectors.
2. All 5 live typing step sequences (`committed` and `composing`).
3. All 4 progressive backspace sequences (`ሰ` → `ስ` → empty).
4. All 1,758 authentic Amharic corpus words.

---

## 4. Installation Instructions

### Option A: User-Level Installation (No `sudo` required)
Installs the binary to `~/.local/libexec/` and component XML to `~/.local/share/ibus/component/`:
```bash
./install.sh
# or:
make install-user
```

### Option B: System-Wide Installation
Installs to `/usr/libexec/` and `/usr/share/ibus/component/`:
```bash
sudo ./install.sh --system
# or:
sudo make install
```

### Restart IBus
```bash
ibus restart
```

---

## 5. Adding the Input Source in GNOME & KDE

### In GNOME (Ubuntu, Fedora, Debian, RHEL)
1. Open **Settings** → **Keyboard**.
2. Under **Input Sources**, click **"+" (Add)**.
3. Click the three dots (More) and search for **"Amharic"**.
4. Select **"Amharic (Addiyon Phonetic)"**.
5. Switch input source using `Super + Space` or click the top-bar input selector.

### In KDE Plasma
1. Open **System Settings** → **Input Devices** → **Keyboard** → **Layouts**.
2. Set Virtual Keyboard / Input Method framework to **IBus**.
3. Add **Amharic (Addiyon Phonetic)** under IBus preferences (`ibus-setup`).

---

## 6. Debian Packaging (`.deb`)

To build a standalone `.deb` package:
```bash
mkdir -p build/pkg/DEBIAN
mkdir -p build/pkg/usr/libexec
mkdir -p build/pkg/usr/share/ibus/component

cp build/ibus-engine-amharic build/pkg/usr/libexec/
cp build/amharic.xml build/pkg/usr/share/ibus/component/

cat << 'EOF' > build/pkg/DEBIAN/control
Package: ibus-amharic
Version: 1.0.0
Section: utils
Priority: optional
Architecture: amd64
Depends: ibus (>= 1.5.0), libglib2.0-0
Maintainer: Antigravity <info@example.com>
Description: Amharic Phonetic Input Method Engine for IBus (Addiyon Scheme)
 Converts Latin input into Amharic (Ethiopic) script in real time.
EOF

dpkg-deb --build build/pkg ibus-amharic_1.0.0_amd64.deb
```

---

## 7. Manual QA Checklist

- [ ] **Web Browser (Firefox / Chrome)**:
  - Focus a search field (e.g. Google search bar).
  - Type `selam`: preedit displays `ስ`, `ሰ`, `ሰል`, `ሰላ`, `ሰላም`.
  - Press Space: commits `ሰላም `.
  - Type `hua`: preedit updates `ህ` → `ሁ` → `ኋ`.
  - Press Backspace: progressive backspace decomposes `ኋ` → `ሁ` → `ህ` → empty.
- [ ] **Text Editor (gedit / Kate / VSCode)**:
  - Type `endiet nesh`: verifies vowels `ie` generate `ኤ`/`ዴ` correctly.
  - Press `Ctrl + Space`: toggles to English. Type `hello` (inserts Latin `hello`).
  - Press `Ctrl + Space`: toggles back to Amharic. Type `selam` (inserts `ሰላም`).
- [ ] **Terminal (GNOME Terminal / kitty / Alacritty)**:
  - Type in shell prompt. Check that IBus preedit text renders above the cursor line without breaking terminal readline.
- [ ] **Chat Apps (Telegram / Slack / Discord)**:
  - Type `tena yist'illign`. Verify that Return key commits `ጤና ይስጥልኝ` and sends message.
  - Click outside text field: verify `focus_out` commits pending text and leaves no orphan preedit windows.

---

## 8. Known Limitations

1. **Wayland Native Popups**: In pure Wayland sessions without `ibus-wayland` integration, preedit popup rendering depends on the compositor's text-input-v3 support. In GNOME Wayland, native IBus integration works out-of-the-box.
2. **Terminal Direct Input**: Certain minimal terminal emulators that disable IBus XIM/Wayland protocols will receive raw Latin key events.
