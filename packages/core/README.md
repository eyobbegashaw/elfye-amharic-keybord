# @amharic-keyboard/core

Zero-dependency, cross-platform Amharic (Ethiopic/Ge'ez) Phonetic transliteration engine following the **Addiyon Keyboard** scheme.

Published as an npm package supporting both **ESM** and **CommonJS (CJS)** with full TypeScript types (`.d.ts`).

---

## 1. Features
- **Deterministic Addiyon Scheme**: 100% compliant with the Addiyon phonetic keyboard layout.
- **7 Vowel Orders + 8th Labialized Column**: Generates characters via base code point offsets + irregular labial overrides (`ኋ`, `ቋ`, `ኳ`, `ዃ`, `ጓ`).
- **Live Typing Engine (`LiveTypingEngine`)**: Keeps active composing buffer with progressive backspace (`ሰ` → `ስ` → empty) and syllable committing for native IMEs and web inputs.
- **Pure Transliteration Function (`transliterate`)**: Ultra-fast whole-string batch transliteration.
- **Case-Sensitive Disambiguation**: Differentiates standard vs homophone consonants (`s`=ሰ vs `S`=ሠ, `t`=ተ vs `T`=ጠ, etc.).
- **Digraph Support with Escape**: Greedy longest match for digraphs (`sh`, `ch`, `gn`, `kh`, `zh`, `ts`, `Ts`), with `'` escape character to break digraphs (`s'h` = `ስህ`).
- **Ethiopic Punctuation**: Automatic conversion of `,` → `፣`, `.` → `።`, `;` → `፤`, `:` → `፡`.
- **Zero Runtime Dependencies**: Ultra-lightweight, runs in Node, browsers, React Native, Electron, and is designed for direct 1:1 algorithmic porting to Java, Swift, C, Rust.

---

## 2. Transliteration Rules Chart (Addiyon Scheme)

### 2.1 Seven Vowel Orders + 8th Labialized Column
Suffix attached to any consonant selects its order:

| Order | Traditional Name | Suffix | Example (`h`) | Example (`s`) | Example (`m`) |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **1st** | ግዕዝ (Ge'ez) | `e` | he → **ሀ** | se → **ሰ** | me → **መ** |
| **2nd** | ካዕብ (Ka'eb) | `u` | hu → **ሁ** | su → **ሱ** | mu → **ሙ** |
| **3rd** | ሣልስ (Sales) | `i` | hi → **ሂ** | si → **ሲ** | mi → **ሚ** |
| **4th** | ራብዕ (Rabe) | `a` | ha → **ሃ** | sa → **ሳ** | ma → **ማ** |
| **5th** | ኃምስ (Hames) | `ie` | hie → **ሄ** | sie → **ሴ** | mie → **ሜ** |
| **6th** | ሳድስ (Sades) | *(none)* | h → **ህ** | s → **ስ** | m → **ም** |
| **7th** | ሳብዕ (Sabe) | `o` | ho → **ሆ** | so → **ሶ** | mo → **ሞ** |
| **8th** | ራብዕ ዘካዕብ (Labialized) | `ua` *(or `wa`)* | hua → **ኋ** | sua → **ሷ** | mua → **ሟ** |

> **Unambiguity Principle**: `hel` produces **ሀል** and `hal` produces **ሃል**.

---

### 2.2 Consonant Table

| Token | 1st (e) | 2nd (u) | 3rd (i) | 4th (a) | 5th (ie) | 6th (sixth) | 7th (o) | 8th (ua) | Unicode Base | Notes |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **h** | ሀ | ሁ | ሂ | ሃ | ሄ | ህ | ሆ | ኋ | `0x1200` | 8th is override `0x128B` |
| **l** | ለ | ሉ | ሊ | ላ | ሌ | ል | ሎ | ሏ | `0x1208` | |
| **H** | ሐ | ሑ | ሒ | ሓ | ሔ | ሕ | ሖ | - | `0x1210` | ሐ row (no 8th in chart) |
| **m** | መ | ሙ | ሚ | ማ | ሜ | ም | ሞ | ሟ | `0x1218` | |
| **S** | ሠ | ሡ | ሢ | ሣ | ሤ | ሥ | ሦ | ሧ | `0x1220` | Homophone ሠ |
| **r** | ረ | ሩ | ሪ | ራ | ሬ | ር | ሮ | ሯ | `0x1228` | |
| **s** | ሰ | ሱ | ሲ | ሳ | ሴ | ስ | ሶ | ሷ | `0x1230` | Standard ሰ |
| **sh** | ሸ | ሹ | ሺ | ሻ | ሼ | ሽ | ሾ | ሿ | `0x1238` | Digraph |
| **q** | ቀ | ቁ | ቂ | ቃ | ቄ | ቅ | ቆ | ቋ | `0x1240` | 8th is override `0x124B` |
| **b** | በ | ቡ | ቢ | ባ | ቤ | ብ | ቦ | ቧ | `0x1260` | |
| **v** | ቨ | ቩ | ቪ | ቫ | ቬ | ቭ | ቮ | ቯ | `0x1268` | |
| **t** | ተ | ቱ | ቲ | ታ | ቴ | ት | ቶ | ቷ | `0x1270` | |
| **ch** | ቸ | ቹ | ቺ | ቻ | ቼ | ች | ቾ | ቿ | `0x1278` | Digraph (`c` is alias) |
| **n** | ነ | ኑ | ኒ | ና | ኔ | ን | ኖ | ኗ | `0x1290` | |
| **gn** | ኘ | ኙ | ኚ | ኛ | ኜ | ኝ | ኞ | ኟ | `0x1298` | Digraph |
| **k** | ከ | ኩ | ኪ | ካ | ኬ | ክ | ኮ | ኳ | `0x12A8` | 8th is override `0x12B3` |
| **kh** | ኸ | ኹ | ኺ | ኻ | ኼ | ኽ | ኾ | ዃ | `0x12B8` | 8th is override `0x12C3` |
| **w** | ወ | ዉ | ዊ | ዋ | ዌ | ው | ዎ | - | `0x12C8` | No 8th form |
| **z** | ዘ | ዙ | ዚ | ዛ | ዜ | ዝ | ዞ | ዟ | `0x12D8` | |
| **zh** | ዠ | ዡ | ዢ | ዣ | ዤ | ዥ | ዦ | ዧ | `0x12E0` | Digraph |
| **y** | የ | ዩ | ዪ | ያ | ዬ | ይ | ዮ | - | `0x12E8` | No 8th form |
| **d** | ደ | ዱ | ዲ | ዳ | ዴ | ድ | ዶ | ዷ | `0x12F0` | |
| **j** | ጀ | ጁ | ጂ | ጃ | ጄ | ጅ | ጆ | ጇ | `0x1300` | |
| **g** | ገ | ጉ | ጊ | ጋ | ጌ | ግ | ጎ | ጓ | `0x1308` | 8th is override `0x1313` |
| **T** | ጠ | ጡ | ጢ | ጣ | ጤ | ጥ | ጦ | ጧ | `0x1320` | Glottalic ጠ |
| **C** | ጨ | ጩ | ጪ | ጫ | ጬ | ጭ | ጮ | ጯ | `0x1328` | Glottalic ጨ |
| **P** | ጰ | ጱ | ጲ | ጳ | ጴ | ጵ | ጶ | ጷ | `0x1330` | Glottalic ጰ |
| **ts** | ጸ | ጹ | ጺ | ጻ | ጼ | ጽ | ጾ | ጿ | `0x1338` | Standard ጸ |
| **Ts** | ፀ | ፁ | ፂ | ፃ | ፄ | ፅ | ፆ | ፇ | `0x1340` | Homophone ፀ |
| **f** | ፈ | ፉ | ፊ | ፋ | ፌ | ፍ | ፎ | ፏ | `0x1348` | Standard ፈ |
| **p** | ፐ | ፑ | ፒ | ፓ | ፔ | ፕ | ፖ | ፗ | `0x1350` | Standard ፐ |
| **hh** / **x** | ኀ | ኁ | ኂ | ኃ | ኄ | ኅ | ኆ | ኋ | `0x1280` | Configurable ኀ row |

---

### 2.3 Lone Vowels & Pharyngeals

#### Lone Vowels (አ Row)
| Input | Output | Order | Unicode |
|:---:|:---:|:---:|:---:|
| `a` | **አ** | 1st (ግዕዝ) | `0x12A0` |
| `u` | **ኡ** | 2nd (ካዕብ) | `0x12A1` |
| `i` | **ኢ** | 3rd (ሣልስ) | `0x12A2` |
| `ie` | **ኤ** | 5th (ኃምስ) | `0x12A4` |
| `e` | **እ** | 6th (ሳድስ) | `0x12A5` |
| `o` | **ኦ** | 7th (ሳብዕ) | `0x12A6` |
| `aa` | **ኣ** | 4th (ራብዕ) | `0x12A3` *(configurable)* |
| `ea` | **ኧ** | 8th | `0x12A7` *(configurable)* |

#### Pharyngeal Lone Vowels (ዐ Row, Uppercase)
| Input | Output | Order | Unicode |
|:---:|:---:|:---:|:---:|
| `A` | **ዐ** | 1st (ግዕዝ) | `0x12D0` |
| `U` | **ዑ** | 2nd (ካዕብ) | `0x12D1` |
| `I` | **ዒ** | 3rd (ሣልስ) | `0x12D2` |
| `E` | **ዕ** | 6th (ሳድስ) | `0x12D5` |
| `O` | **ዖ** | 7th (ሳብዕ) | `0x12D6` |
| `Aa` / `AA` | **ዓ** | 4th (ራብዕ) | `0x12D3` *(configurable)* |
| `Aie` / `EE` | **ዔ** | 5th (ኃምስ) | `0x12D4` *(configurable)* |

---

### 2.4 Punctuation and Escape
- `,` → **፣** (`0x1363`)
- `.` → **።** (`0x1362`)
- `;` → **፤** (`0x1364`)
- `:` → **፡** (`0x1361`)
- Escape `'`: breaks digraphs (`s'h` → `ስህ`), breaks syllables (`se'el` → `ሰእል`). Double escape `''` outputs a literal `'`.

---

## 3. Installation & Usage

```bash
pnpm add @amharic-keyboard/core
```

### 3.1 Whole-String Transliteration
```typescript
import { transliterate } from '@amharic-keyboard/core';

console.log(transliterate('selam , endiet nesh'));
// Output: ሰላም ፣ እንዴት ነሽ

console.log(transliterate('he ha hie h ho hua'));
// Output: ሀ ሃ ሄ ህ ሆ ኋ
```

### 3.2 Live Typing Engine (IME & Input components)
```typescript
import { LiveTypingEngine } from '@amharic-keyboard/core';

const engine = new LiveTypingEngine();

// Keystroke by keystroke
console.log(engine.input('s')); // { committed: '', composing: 'ስ' }
console.log(engine.input('e')); // { committed: '', composing: 'ሰ' }
console.log(engine.input('l')); // { committed: 'ሰ', composing: 'ል' }
console.log(engine.input('a')); // { committed: '', composing: 'ላ' }
console.log(engine.input('m')); // { committed: 'ላ', composing: 'ም' }
console.log(engine.input(' ')); // { committed: 'ም ', composing: '' }

// Progressive Backspace
engine.input('s'); // composing: 'ስ'
engine.input('e'); // composing: 'ሰ'
console.log(engine.backspace()); // { committed: '', composing: 'ስ' }
console.log(engine.backspace()); // { committed: '', composing: '' }
```
