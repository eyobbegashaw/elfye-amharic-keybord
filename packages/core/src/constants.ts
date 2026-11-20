import { EthiopicOrder } from './types.js';

/**
 * Standard vowel suffix definitions for the Addiyon scheme.
 * Order in array corresponds to greedy matching priority (longer strings first).
 */
export const VOWEL_TOKENS: Array<{ token: string; order: EthiopicOrder }> = [
  { token: 'ie', order: EthiopicOrder.Hames },   // 5th (ኃምስ)
  { token: 'ua', order: EthiopicOrder.Labial },  // 8th (ላብያል / ራብዕ ዘካዕብ)
  { token: 'e', order: EthiopicOrder.GeEz },     // 1st (ግዕዝ)
  { token: 'u', order: EthiopicOrder.KaEb },     // 2nd (ካዕብ)
  { token: 'i', order: EthiopicOrder.Sales },    // 3rd (ሣልስ)
  { token: 'a', order: EthiopicOrder.Rabe },     // 4th (ራብዕ)
  { token: 'o', order: EthiopicOrder.Sabe },     // 7th (ሳብዕ)
];

/**
 * Consonant definition containing Unicode base code point,
 * whether the 8th labialized form exists, and any irregular 8th code point override.
 */
export interface ConsonantMeta {
  base: number;
  hasLabial: boolean;
  labialOverride?: number;
}

/**
 * Base consonants mapping.
 * Note: Greedy longest match sorts multi-letter consonants before single-letter ones.
 */
export const CONSONANT_DEFINITIONS: Record<string, ConsonantMeta> = {
  // Trigraphs / Digraphs first
  sh: { base: 0x1238, hasLabial: true },              // ሸ..ሿ (0x123F)
  ch: { base: 0x1278, hasLabial: true },              // ቸ..ቿ (0x127F)
  gn: { base: 0x1298, hasLabial: true },              // ኘ..ኟ (0x129F)
  kh: { base: 0x12B8, hasLabial: true, labialOverride: 0x12C3 }, // ኸ..ዃ
  zh: { base: 0x12E0, hasLabial: true },              // ዠ..ዧ (0x12E7)
  ts: { base: 0x1338, hasLabial: true },              // ጸ..ጿ (0x133F)
  Ts: { base: 0x1340, hasLabial: true },              // ፀ..ፇ (0x1347)
  
  // Single letter consonants
  h:  { base: 0x1200, hasLabial: true, labialOverride: 0x128B }, // ሀ..ኋ
  l:  { base: 0x1208, hasLabial: true },              // ለ..ሏ (0x120F)
  H:  { base: 0x1210, hasLabial: false },             // ሐ..ሖ (no 8th in chart)
  m:  { base: 0x1218, hasLabial: true },              // መ..ሟ (0x121F)
  S:  { base: 0x1220, hasLabial: true },              // ሠ..ሧ (0x1227)
  r:  { base: 0x1228, hasLabial: true },              // ረ..ሯ (0x122F)
  s:  { base: 0x1230, hasLabial: true },              // ሰ..ሷ (0x1237)
  q:  { base: 0x1240, hasLabial: true, labialOverride: 0x124B }, // ቀ..ቋ
  b:  { base: 0x1260, hasLabial: true },              // በ..ቧ (0x1267)
  v:  { base: 0x1268, hasLabial: true },              // ቨ..ቯ (0x126F)
  t:  { base: 0x1270, hasLabial: true },              // ተ..ቷ (0x1277)
  c:  { base: 0x1278, hasLabial: true },              // shortcut for ቸ
  n:  { base: 0x1290, hasLabial: true },              // ነ..ኗ (0x1297)
  k:  { base: 0x12A8, hasLabial: true, labialOverride: 0x12B3 }, // ከ..ኳ
  w:  { base: 0x12C8, hasLabial: false },            // ወ..ዎ (no 8th in chart)
  z:  { base: 0x12D8, hasLabial: true },              // ዘ..ዟ (0x12DF)
  y:  { base: 0x12E8, hasLabial: false },            // የ..ዮ (no 8th in chart)
  d:  { base: 0x12F0, hasLabial: true },              // ደ..ዷ (0x12F7)
  j:  { base: 0x1300, hasLabial: true },              // ጀ..ጇ (0x1307)
  g:  { base: 0x1308, hasLabial: true, labialOverride: 0x1313 }, // ገ..ጓ
  T:  { base: 0x1320, hasLabial: true },              // ጠ..ጧ (0x1327)
  C:  { base: 0x1328, hasLabial: true },              // ጨ..ጯ (0x132F)
  P:  { base: 0x1330, hasLabial: true },              // ጰ..ጷ (0x1337)
  f:  { base: 0x1348, hasLabial: true },              // ፈ..ፏ (0x134F)
  p:  { base: 0x1350, hasLabial: true },              // ፐ..ፗ (0x1357)

  // ኀ row (customizable / standard Ge'ez homophone)
  hh: { base: 0x1280, hasLabial: true, labialOverride: 0x128B }, // ኀ..ኋ
  x:  { base: 0x1280, hasLabial: true, labialOverride: 0x128B }, // alternative alias for ኀ
};

/**
 * Lone vowel row (አ row, base 0x12A0).
 * In Addiyon:
 *  a  = አ (1st form, 0x12A0)
 *  u  = ኡ (2nd form, 0x12A1)
 *  i  = ኢ (3rd form, 0x12A2)
 *  ie = ኤ (5th form, 0x12A4)
 *  e  = እ (6th form, 0x12A5)
 *  o  = ኦ (7th form, 0x12A6)
 * Extended/Configurable:
 *  aa = ኣ (4th form, 0x12A3)
 *  ea = ኧ (8th form, 0x12A7)
 */
export const LONE_VOWELS: Record<string, string> = {
  ie: '\u12A4', // ኤ
  aa: '\u12A3', // ኣ (4th form of አ)
  ea: '\u12A7', // ኧ (8th form of አ)
  a:  '\u12A0', // አ
  u:  '\u12A1', // ኡ
  i:  '\u12A2', // ኢ
  e:  '\u12A5', // እ
  o:  '\u12A6', // ኦ
};

/**
 * Pharyngeal lone vowel row (ዐ row, base 0x12D0).
 * In Addiyon:
 *  A = ዐ (1st form, 0x12D0)
 *  U = ዑ (2nd form, 0x12D1)
 *  I = ዒ (3rd form, 0x12D2)
 *  E = ዕ (6th form, 0x12D5)
 *  O = ዖ (7th form, 0x12D6)
 * Extended/Configurable:
 *  AA = ዓ (4th form, 0x12D3)
 *  Aa = ዓ (4th form, 0x12D3)
 *  Aie = ዔ (5th form, 0x12D4)
 *  EE = ዔ (5th form, 0x12D4)
 *  Ie = ዔ (5th form, 0x12D4)
 */
export const PHARYNGEAL_VOWELS: Record<string, string> = {
  Aie: '\u12D4', // ዔ
  AA:  '\u12D3', // ዓ
  Aa:  '\u12D3', // ዓ
  EE:  '\u12D4', // ዔ
  Ie:  '\u12D4', // ዔ
  A:   '\u12D0', // ዐ
  U:   '\u12D1', // ዑ
  I:   '\u12D2', // ዒ
  E:   '\u12D5', // ዕ
  O:   '\u12D6', // ዖ
};

/**
 * Ethiopic punctuation mapping.
 */
export const PUNCTUATION_MAP: Record<string, string> = {
  ',': '\u1363', // ፣ (Ethiopic comma)
  '.': '\u1362', // ። (Ethiopic full stop)
  ';': '\u1364', // ፤ (Ethiopic semicolon)
  ':': '\u1361', // ፡ (Ethiopic wordspace)
};

/**
 * Ethiopic numeral conversion.
 */
export const ETHIOPIC_DIGITS: Record<string, string> = {
  '1': '\u1369', // ፩
  '2': '\u136A', // ፪
  '3': '\u136B', // ፫
  '4': '\u136C', // ፬
  '5': '\u136D', // ፭
  '6': '\u136E', // ፮
  '7': '\u136F', // ፯
  '8': '\u1370', // ፰
  '9': '\u1371', // ፱
};
