# @elfye/react

[![npm version](https://img.shields.io/npm/v/@elfye/react.svg?style=flat-square)](https://www.npmjs.com/package/@elfye/react)
[![license](https://img.shields.io/npm/l/@elfye/react.svg?style=flat-square)](https://github.com/elfye/elfye/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/elfye/elfye/ci.yml?branch=main&label=CI&style=flat-square)](https://github.com/elfye/elfye/actions)

NPM package providing React hooks and components for real-time Amharic (Ethiopic) phonetic transliteration following the **Addiyon Keyboard scheme**.

## Features

- **Hook & Ready-to-use Components**: `useAmharic` hook, `<AmharicInput />`, and `<AmharicTextarea />`.
- **Level 2 Input Events (`beforeinput`)**: Intercepts `insertText`, `insertCompositionText`, and `deleteContentBackward`. Does not rely solely on `input`.
- **Accurate Caret & Selection**: Transliterates at the active caret position (not only at the end of the input). Restores caret position via layout effects.
- **Android Chrome & Virtual Keyboard Support**: Seamlessly handles IME composition events (`compositionstart`, `compositionupdate`, `compositionend`) and `keyCode 229` without double-insertions.
- **Progressive Backspace**: Decomposes multi-keystroke syllables step-by-step (`ሰ` → `ስ` → empty) rather than deleting the entire syllable at once.
- **Native Undo/Redo Preservation**: Leverages `document.execCommand('insertText')` where supported so the native browser undo stack (`Ctrl+Z` / `Cmd+Z`) remains usable.
- **Fast Paste Transliteration**: Pasting Latin text automatically converts it to Amharic.
- **Keyboard Shortcut**: Built-in `Ctrl+Space` (or `Cmd+Space`) toggle between English and Amharic.

## Installation

```bash
pnpm add @elfye/react @elfye/core
# or
npm install @elfye/react @elfye/core
```

## Quick Start

### 1. Using `<AmharicTextarea />` or `<AmharicInput />`

```tsx
import { useState } from 'react';
import { AmharicTextarea, AmharicInput } from '@elfye/react';

export function Example() {
  const [text, setText] = useState('');
  const [enabled, setEnabled] = useState(true);

  return (
    <div>
      <AmharicTextarea
        enabled={enabled}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="እዚህ ይተይቡ (e.g. selam -> ሰላም)..."
        rows={5}
      />
      <button onClick={() => setEnabled((prev) => !prev)}>
        {enabled ? 'Switch to English' : 'Switch to Amharic'}
      </button>
    </div>
  );
}
```

### 2. Using `useAmharic` Hook

```tsx
import { useAmharic } from '@elfye/react';

export function CustomInput() {
  const { bind, enabled, toggleEnabled } = useAmharic();

  return (
    <div>
      <input {...bind} placeholder="Type in Amharic..." />
      <button onClick={toggleEnabled}>
        Toggle ({enabled ? 'Amharic' : 'English'})
      </button>
    </div>
  );
}
```

## Behavior & Android Chrome Emulation Notes

1. **Android Chrome Virtual Keyboard**:
   Android Chrome fires `compositionstart`, `beforeinput` (`insertCompositionText`), and `compositionend`, often accompanied by generic `keyCode 229`. `useAmharic` monitors composition lifecycle and prevents duplicate insertions when `compositionend` synthesizes fallback input events.
2. **Native Undo / Redo**:
   When `document.execCommand('insertText')` is supported by the browser, edits are committed directly through the browser's native editing pipeline, maintaining the user's native undo history. In headless or unsupported environments, it falls back to prototype value setter and dispatches an `input` event.
3. **Buffer Management**:
   The composition buffer is automatically finalized when the user enters whitespace, Ethiopic/Latin punctuation, hits `Enter`, clicks away (`blur`), or moves the caret using the arrow keys or mouse selection.
