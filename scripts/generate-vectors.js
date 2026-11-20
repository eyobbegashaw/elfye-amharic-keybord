import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------------------------------------
// 1. Full Transliteration Test Vectors
// -------------------------------------------------------------------------
const fullTransliteration = [
  // User Prompt Primary Examples
  { input: "selam , endiet nesh", expected: "ሰላም ፣ እንዴት ነሽ", description: "Prompt primary test case" },
  { input: "selam", expected: "ሰላም", description: "Standard greeting" },
  { input: "endiet nesh", expected: "እንዴት ነሽ", description: "How are you (fem.)" },
  { input: "endiet neh", expected: "እንዴት ነህ", description: "How are you (masc.)" },
  
  // 7 Orders + Labialized 8th column
  { input: "he", expected: "ሀ", description: "1st order (Ge'ez)" },
  { input: "hu", expected: "ሁ", description: "2nd order (Ka'eb)" },
  { input: "hi", expected: "ሂ", description: "3rd order (Sales)" },
  { input: "ha", expected: "ሃ", description: "4th order (Rabe)" },
  { input: "hie", expected: "ሄ", description: "5th order (Hames)" },
  { input: "h", expected: "ህ", description: "6th order (Sades)" },
  { input: "ho", expected: "ሆ", description: "7th order (Sabe)" },
  { input: "hua", expected: "ኋ", description: "8th order (Labialized)" },
  { input: "he ha hie h ho hua", expected: "ሀ ሃ ሄ ህ ሆ ኋ", description: "Full order sequence for h" },
  { input: "hel", expected: "ሀል", description: "Unambiguous 1st order + 6th" },
  { input: "hal", expected: "ሃል", description: "Unambiguous 4th order + 6th" },

  // Locked Defaults for Rare/Unlabeled Forms:
  // 4th of አ: "aa" = ኣ
  { input: "aa", expected: "ኣ", description: "4th form of አ (ኣ = 'aa')" },
  // 4th and 5th of ዐ: "Aa" (alias "AA") = ዓ, "Aie" (alias "EE") = ዔ
  { input: "Aa", expected: "ዓ", description: "4th form of ዐ (ዓ = 'Aa')" },
  { input: "AA", expected: "ዓ", description: "4th form of ዐ alias (ዓ = 'AA')" },
  { input: "Aie", expected: "ዔ", description: "5th form of ዐ (ዔ = 'Aie')" },
  { input: "EE", expected: "ዔ", description: "5th form of ዐ alias (ዔ = 'EE')" },
  // ኀ row: "hh" (alias "x")
  { input: "hhe", expected: "ኀ", description: "1st form of ኀ ('hhe')" },
  { input: "hha", expected: "ኃ", description: "4th form of ኀ ('hha')" },
  { input: "hhie", expected: "ኄ", description: "5th form of ኀ ('hhie')" },
  { input: "hh", expected: "ኅ", description: "6th form of ኀ ('hh')" },
  { input: "hhua", expected: "ኋ", description: "8th form of ኀ (ኋ = U+128B)" },
  { input: "xe", expected: "ኀ", description: "1st form of ኀ alias ('xe')" },
  // f = ፈ row (standard)
  { input: "fe", expected: "ፈ", description: "1st form of f (ፈ)" },
  { input: "fa", expected: "ፋ", description: "4th form of f (ፋ)" },
  { input: "fie", expected: "ፌ", description: "5th form of f (ፌ)" },
  { input: "f", expected: "ፍ", description: "6th form of f (ፍ)" },
  { input: "fua", expected: "ፏ", description: "8th form of f (ፏ)" },
  { input: "fwa", expected: "ፏ", description: "8th form of f with wa alias (ፏ)" },
  // ኧ (8th of አ) = "ea"
  { input: "ea", expected: "ኧ", description: "8th form of አ (ኧ = 'ea')" },

  // Labialized wa alias vs escape k'wa
  { input: "kwa", expected: "ኳ", description: "kwa labialized alias for kua (ኳ)" },
  { input: "k'wa", expected: "ክዋ", description: "k'wa escape breaking labialization to produce ክዋ" },
  { input: "gwa", expected: "ጓ", description: "gwa labialized alias for gua (ጓ)" },
  { input: "g'wa", expected: "ግዋ", description: "g'wa escape breaking labialization to produce ግዋ" },
  { input: "qwa", expected: "ቋ", description: "qwa labialized alias for qua (ቋ)" },
  { input: "q'wa", expected: "ቅዋ", description: "q'wa escape breaking labialization to produce ቅዋ" },
  { input: "hwa", expected: "ኋ", description: "hwa labialized alias for hua (ኋ)" },
  { input: "h'wa", expected: "ህዋ", description: "h'wa escape breaking labialization to produce ህዋ" },

  // Homophones & Case Sensitivity
  { input: "se", expected: "ሰ", description: "Lowercase s (ሰ)" },
  { input: "Se", expected: "ሠ", description: "Uppercase S (ሠ - rarer homophone)" },
  { input: "te", expected: "ተ", description: "Lowercase t (ተ)" },
  { input: "Te", expected: "ጠ", description: "Uppercase T (ጠ - glottalic)" },
  { input: "che", expected: "ቸ", description: "Lowercase ch (ቸ)" },
  { input: "Ce", expected: "ጨ", description: "Uppercase C (ጨ - glottalic)" },
  { input: "pe", expected: "ፐ", description: "Lowercase p (ፐ)" },
  { input: "Pe", expected: "ጰ", description: "Uppercase P (ጰ)" },
  { input: "tse", expected: "ጸ", description: "Lowercase ts (ጸ)" },
  { input: "Tse", expected: "ፀ", description: "Mixed case Ts (ፀ - homophone)" },
  { input: "she", expected: "ሸ", description: "Digraph sh (ሸ)" },
  { input: "gne", expected: "ኘ", description: "Digraph gn (ኘ)" },
  { input: "khe", expected: "ኸ", description: "Digraph kh (ኸ)" },
  { input: "zhe", expected: "ዠ", description: "Digraph zh (ዠ)" },

  // Lone Vowels (አ row) vs Pharyngeal Row (ዐ row)
  { input: "a", expected: "አ", description: "Lone vowel a (አ - 1st order)" },
  { input: "u", expected: "ኡ", description: "Lone vowel u (ኡ)" },
  { input: "i", expected: "ኢ", description: "Lone vowel i (ኢ)" },
  { input: "ie", expected: "ኤ", description: "Lone vowel ie (ኤ - 5th order)" },
  { input: "e", expected: "እ", description: "Lone vowel e (እ - 6th order)" },
  { input: "o", expected: "ኦ", description: "Lone vowel o (ኦ)" },
  { input: "A", expected: "ዐ", description: "Pharyngeal lone vowel A (ዐ - 1st order)" },
  { input: "U", expected: "ዑ", description: "Pharyngeal lone vowel U (ዑ)" },
  { input: "I", expected: "ዒ", description: "Pharyngeal lone vowel I (ዒ)" },
  { input: "E", expected: "ዕ", description: "Pharyngeal lone vowel E (ዕ - 6th order)" },
  { input: "O", expected: "ዖ", description: "Pharyngeal lone vowel O (ዖ)" },

  // Labialized forms (regular & overrides)
  { input: "lua", expected: "ሏ", description: "Labialized l" },
  { input: "mua", expected: "ሟ", description: "Labialized m" },
  { input: "rua", expected: "ሯ", description: "Labialized r" },
  { input: "sua", expected: "ሷ", description: "Labialized s" },
  { input: "shua", expected: "ሿ", description: "Labialized sh" },
  { input: "qua", expected: "ቋ", description: "Labialized q (override)" },
  { input: "bua", expected: "ቧ", description: "Labialized b" },
  { input: "vua", expected: "ቯ", description: "Labialized v" },
  { input: "tua", expected: "ቷ", description: "Labialized t" },
  { input: "chua", expected: "ቿ", description: "Labialized ch" },
  { input: "nua", expected: "ኗ", description: "Labialized n" },
  { input: "gnua", expected: "ኟ", description: "Labialized gn" },
  { input: "kua", expected: "ኳ", description: "Labialized k (override)" },
  { input: "khua", expected: "ዃ", description: "Labialized kh (override)" },
  { input: "zua", expected: "ዟ", description: "Labialized z" },
  { input: "zhua", expected: "ዧ", description: "Labialized zh" },
  { input: "dua", expected: "ዷ", description: "Labialized d" },
  { input: "jua", expected: "ጇ", description: "Labialized j" },
  { input: "gua", expected: "ጓ", description: "Labialized g (override)" },
  { input: "Tua", expected: "ጧ", description: "Labialized T" },
  { input: "Cua", expected: "ጯ", description: "Labialized C" },
  { input: "Pua", expected: "ጷ", description: "Labialized P" },
  { input: "tsua", expected: "ጿ", description: "Labialized ts" },
  { input: "Tsua", expected: "ፇ", description: "Labialized Ts" },
  { input: "pua", expected: "ፗ", description: "Labialized p" },

  // Escape Character (breaking digraphs & syllables)
  { input: "s'h", expected: "ስህ", description: "Escape breaking sh digraph" },
  { input: "t's", expected: "ትስ", description: "Escape breaking ts digraph" },
  { input: "T's", expected: "ጥስ", description: "Escape breaking Ts digraph" },
  { input: "k'h", expected: "ክህ", description: "Escape breaking kh digraph" },
  { input: "g'n", expected: "ግን", description: "Escape breaking gn digraph" },
  { input: "se'el", expected: "ሰእል", description: "Escape before lone vowel" },
  { input: "a''b", expected: "አ'ብ", description: "Double apostrophe escapes literal apostrophe" },

  // Punctuation
  { input: ",", expected: "፣", description: "Ethiopic comma" },
  { input: ".", expected: "።", description: "Ethiopic full stop" },
  { input: ";", expected: "፤", description: "Ethiopic semicolon" },
  { input: ":", expected: "፡", description: "Ethiopic wordspace" },
  { input: "selam. dehna neh?", expected: "ሰላም። ደህና ነህ?", description: "Sentence with Ethiopic full stop" },
  { input: "and, hulet, sost.", expected: "አንድ፣ ሁለት፣ ሶስት።", description: "List with commas and full stop" }
];

// -------------------------------------------------------------------------
// 2. Live Typing Keystroke Sequences
// -------------------------------------------------------------------------
const liveTypingSequences = [
  {
    name: "Live typing 'selam'",
    steps: [
      { input: "s", expectedCommitted: "", expectedComposing: "ስ" },
      { input: "e", expectedCommitted: "", expectedComposing: "ሰ" },
      { input: "l", expectedCommitted: "ሰ", expectedComposing: "ል" },
      { input: "a", expectedCommitted: "", expectedComposing: "ላ" },
      { input: "m", expectedCommitted: "ላ", expectedComposing: "ም" },
      { input: " ", expectedCommitted: "ም ", expectedComposing: "" }
    ]
  },
  {
    name: "Live typing 'hua' (labialized)",
    steps: [
      { input: "h", expectedCommitted: "", expectedComposing: "ህ" },
      { input: "u", expectedCommitted: "", expectedComposing: "ሁ" },
      { input: "a", expectedCommitted: "", expectedComposing: "ኋ" }
    ]
  },
  {
    name: "Live typing 'endiet'",
    steps: [
      { input: "e", expectedCommitted: "", expectedComposing: "እ" },
      { input: "n", expectedCommitted: "እ", expectedComposing: "ን" },
      { input: "d", expectedCommitted: "ን", expectedComposing: "ድ" },
      { input: "i", expectedCommitted: "", expectedComposing: "ዲ" },
      { input: "e", expectedCommitted: "", expectedComposing: "ዴ" },
      { input: "t", expectedCommitted: "ዴ", expectedComposing: "ት" }
    ]
  },
  {
    name: "Live typing digraph 'she'",
    steps: [
      { input: "s", expectedCommitted: "", expectedComposing: "ስ" },
      { input: "h", expectedCommitted: "", expectedComposing: "ሽ" },
      { input: "e", expectedCommitted: "", expectedComposing: "ሸ" }
    ]
  },
  {
    name: "Live typing escape 's\\'h'",
    steps: [
      { input: "s", expectedCommitted: "", expectedComposing: "ስ" },
      { input: "'", expectedCommitted: "ስ", expectedComposing: "" },
      { input: "h", expectedCommitted: "", expectedComposing: "ህ" }
    ]
  }
];

// -------------------------------------------------------------------------
// 3. Backspace Sequences
// -------------------------------------------------------------------------
const backspaceSequences = [
  {
    name: "Typing 'se' and backspacing to empty",
    steps: [
      { action: "type", char: "s", expectedCommitted: "", expectedComposing: "ስ" },
      { action: "type", char: "e", expectedCommitted: "", expectedComposing: "ሰ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "ስ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "" }
    ]
  },
  {
    name: "Typing 'hua' and backspacing sequentially",
    steps: [
      { action: "type", char: "h", expectedCommitted: "", expectedComposing: "ህ" },
      { action: "type", char: "u", expectedCommitted: "", expectedComposing: "ሁ" },
      { action: "type", char: "a", expectedCommitted: "", expectedComposing: "ኋ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "ሁ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "ህ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "" }
    ]
  },
  {
    name: "Typing digraph 'sh' and backspacing",
    steps: [
      { action: "type", char: "s", expectedCommitted: "", expectedComposing: "ስ" },
      { action: "type", char: "h", expectedCommitted: "", expectedComposing: "ሽ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "ስ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "" }
    ]
  },
  {
    name: "Typing 5th order 'die' and backspacing",
    steps: [
      { action: "type", char: "d", expectedCommitted: "", expectedComposing: "ድ" },
      { action: "type", char: "i", expectedCommitted: "", expectedComposing: "ዲ" },
      { action: "type", char: "e", expectedCommitted: "", expectedComposing: "ዴ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "ዲ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "ድ" },
      { action: "backspace", expectedCommitted: "", expectedComposing: "" }
    ]
  }
];

// -------------------------------------------------------------------------
// 4. Load Hand-Written corpus.source.json (Audited Non-Circular Test Source)
// -------------------------------------------------------------------------
const corpusSourcePath = path.resolve(__dirname, '../corpus.source.json');
if (!fs.existsSync(corpusSourcePath)) {
  console.error(`Error: corpus.source.json not found at ${corpusSourcePath}`);
  process.exit(1);
}

const corpusData = JSON.parse(fs.readFileSync(corpusSourcePath, 'utf8'));

// Validate structure without running the engine
const commonWordsCorpus = [];
const unverifiedEntries = [];

for (const entry of corpusData) {
  if (!entry.latin || !entry.amharic) {
    console.error(`Malformed entry in corpus.source.json:`, entry);
    process.exit(1);
  }
  commonWordsCorpus.push({
    latin: entry.latin,
    amharic: entry.amharic,
    ...(entry.unverified ? { unverified: true } : {})
  });

  if (entry.unverified) {
    unverifiedEntries.push(entry);
  }
}

// -------------------------------------------------------------------------
// 5. Generate UNVERIFIED.md for Native Speaker Review
// -------------------------------------------------------------------------
let unverifiedMd = `# UNVERIFIED.md - Amharic Corpus Spelling Review\n\n`;
unverifiedMd += `This document lists all words in \`corpus.source.json\` marked with \`"unverified": true\`.\n`;
unverifiedMd += `These entries involve classical vs colloquial homophones (ሐ vs ሀ vs ኀ, ጸ vs ፀ, ዐ vs አ, etc.) or dialectal variations for native speaker review.\n\n`;
unverifiedMd += `| Latin Input | Ethiopic Script | Review Reason / Note |\n`;
unverifiedMd += `|---|---|---|\n`;

for (const item of unverifiedEntries) {
  unverifiedMd += `| \`${item.latin}\` | **${item.amharic}** | ${item.note || 'Review homophone selection'} |\n`;
}

const unverifiedDocPath = path.resolve(__dirname, '../UNVERIFIED.md');
fs.writeFileSync(unverifiedDocPath, unverifiedMd, 'utf8');
console.log(`Generated UNVERIFIED.md with ${unverifiedEntries.length} review entries.`);

// -------------------------------------------------------------------------
// 6. Write final test-vectors.json
// -------------------------------------------------------------------------
const testVectors = {
  $schema: "./test-vectors.schema.json",
  version: "1.0.0",
  description: "Cross-platform test vectors for Amharic Phonetic transliteration (Addiyon scheme). Used by TypeScript, Java (Android), Swift (iOS), and Native Desktop IME.",
  metadata: {
    totalFullVectors: fullTransliteration.length,
    totalLiveTypingSequences: liveTypingSequences.length,
    totalBackspaceSequences: backspaceSequences.length,
    totalCorpusWords: commonWordsCorpus.length,
    totalUnverifiedWords: unverifiedEntries.length,
  },
  fullTransliteration,
  liveTypingSequences,
  backspaceSequences,
  commonWordsCorpus
};

const outputPath = path.resolve(__dirname, '../test-vectors.json');
const jsonContent = JSON.stringify(testVectors, null, 2);
fs.writeFileSync(outputPath, jsonContent, 'utf8');

// Also sync copy to Swift package resources (single source of truth)
const iosResourceDir = path.resolve(__dirname, '../apps/ios/AmharicCore/Tests/AmharicCoreTests/Resources');
if (fs.existsSync(iosResourceDir)) {
  fs.writeFileSync(path.join(iosResourceDir, 'test-vectors.json'), jsonContent, 'utf8');
}

console.log(`Generated test-vectors.json successfully:`);
console.log(`- Full transliteration vectors: ${fullTransliteration.length}`);
console.log(`- Live typing sequences: ${liveTypingSequences.length}`);
console.log(`- Backspace sequences: ${backspaceSequences.length}`);
console.log(`- Common words corpus: ${commonWordsCorpus.length} (${unverifiedEntries.length} flagged for review in UNVERIFIED.md)`);
