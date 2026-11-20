import {
  CONSONANT_DEFINITIONS,
  LONE_VOWELS,
  PHARYNGEAL_VOWELS,
  EthiopicOrder,
  getEthiopicChar,
  ConsonantMeta,
} from '@amharic-keyboard/core';

export interface ChartCell {
  order: EthiopicOrder;
  char: string | null;
  keystroke: string;
}

export interface ChartRow {
  key: string;
  category: 'consonant' | 'vowel';
  baseChar: string;
  cells: ChartCell[];
}

/**
 * Standard Addiyon presentation consonant order:
 * h, l, H, m, S, r, s, sh, q, b, v, t, ch, n, gn, k, kh, w, z, zh, y, d, j, g, T, C, P, ts, Ts, p, f, hh
 */
const CONSONANT_DISPLAY_ORDER = [
  'h', 'l', 'H', 'm', 'S', 'r', 's', 'sh', 'q', 'b', 'v', 't',
  'ch', 'n', 'gn', 'k', 'kh', 'w', 'z', 'zh', 'y', 'd', 'j', 'g',
  'T', 'C', 'P', 'ts', 'Ts', 'p', 'f', 'hh',
];

/**
 * Vowel suffixes for the 8 orders in the Addiyon scheme.
 */
const ORDER_SUFFIXES: Record<EthiopicOrder, string> = {
  [EthiopicOrder.GeEz]: 'e',
  [EthiopicOrder.KaEb]: 'u',
  [EthiopicOrder.Sales]: 'i',
  [EthiopicOrder.Rabe]: 'a',
  [EthiopicOrder.Hames]: 'ie',
  [EthiopicOrder.Sades]: '',
  [EthiopicOrder.Sabe]: 'o',
  [EthiopicOrder.Labial]: 'ua',
};

/**
 * Dynamically builds the Addiyon Reference Chart from @amharic-keyboard/core tables.
 * Guaranteed never to drift from the actual core transliteration engine.
 */
export function generateReferenceChart(): ChartRow[] {
  const rows: ChartRow[] = [];

  // 1. Lone Vowels (አ row)
  rows.push({
    key: 'lone_vowels',
    category: 'vowel',
    baseChar: LONE_VOWELS['a'] ?? 'አ',
    cells: [
      { order: EthiopicOrder.GeEz, char: LONE_VOWELS['a'], keystroke: 'a' },
      { order: EthiopicOrder.KaEb, char: LONE_VOWELS['u'], keystroke: 'u' },
      { order: EthiopicOrder.Sales, char: LONE_VOWELS['i'], keystroke: 'i' },
      { order: EthiopicOrder.Rabe, char: LONE_VOWELS['aa'], keystroke: 'aa' },
      { order: EthiopicOrder.Hames, char: LONE_VOWELS['ie'], keystroke: 'ie' },
      { order: EthiopicOrder.Sades, char: LONE_VOWELS['e'], keystroke: 'e' },
      { order: EthiopicOrder.Sabe, char: LONE_VOWELS['o'], keystroke: 'o' },
      { order: EthiopicOrder.Labial, char: LONE_VOWELS['ea'] ?? 'ኧ', keystroke: 'ea' },
    ],
  });

  // 2. Pharyngeal Vowels (ዐ row)
  rows.push({
    key: 'pharyngeal_vowels',
    category: 'vowel',
    baseChar: PHARYNGEAL_VOWELS['A'] ?? 'ዐ',
    cells: [
      { order: EthiopicOrder.GeEz, char: PHARYNGEAL_VOWELS['A'], keystroke: 'A' },
      { order: EthiopicOrder.KaEb, char: PHARYNGEAL_VOWELS['U'], keystroke: 'U' },
      { order: EthiopicOrder.Sales, char: PHARYNGEAL_VOWELS['I'], keystroke: 'I' },
      { order: EthiopicOrder.Rabe, char: PHARYNGEAL_VOWELS['Aa'] ?? 'ዓ', keystroke: 'Aa' },
      { order: EthiopicOrder.Hames, char: PHARYNGEAL_VOWELS['Aie'] ?? 'ዔ', keystroke: 'Aie' },
      { order: EthiopicOrder.Sades, char: PHARYNGEAL_VOWELS['E'], keystroke: 'E' },
      { order: EthiopicOrder.Sabe, char: PHARYNGEAL_VOWELS['O'], keystroke: 'O' },
      { order: EthiopicOrder.Labial, char: null, keystroke: '' },
    ],
  });

  // 3. Consonants
  const allConsonantKeys = new Set([...CONSONANT_DISPLAY_ORDER, ...Object.keys(CONSONANT_DEFINITIONS)]);

  for (const cKey of allConsonantKeys) {
    const meta = (CONSONANT_DEFINITIONS as Record<string, ConsonantMeta | string[]>)[cKey];
    if (!meta) continue;

    const baseChar = getEthiopicChar(meta, EthiopicOrder.GeEz) ?? '';

    const cells: ChartCell[] = [];
    const orders: EthiopicOrder[] = [
      EthiopicOrder.GeEz,
      EthiopicOrder.KaEb,
      EthiopicOrder.Sales,
      EthiopicOrder.Rabe,
      EthiopicOrder.Hames,
      EthiopicOrder.Sades,
      EthiopicOrder.Sabe,
      EthiopicOrder.Labial,
    ];

    for (const ord of orders) {
      const char = getEthiopicChar(meta, ord);
      const suffix = ORDER_SUFFIXES[ord];
      const keystroke = char !== null ? `${cKey}${suffix}` : '';

      cells.push({
        order: ord,
        char,
        keystroke,
      });
    }

    rows.push({
      key: cKey,
      category: 'consonant',
      baseChar,
      cells,
    });
  }

  return rows;
}
