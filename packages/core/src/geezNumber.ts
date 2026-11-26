const UNITS = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
const TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];

function formatUnder100(n: number): string {
  const t = Math.floor(n / 10);
  const u = n % 10;
  return (TENS[t] ?? '') + (UNITS[u] ?? '');
}

/**
 * Converts a non-negative ASCII digit string into standard Ge'ez (Ethiopic) numerals.
 * Examples: "1" -> "፩", "10" -> "፲", "12" -> "፲፪", "100" -> "፻", "2026" -> "፳፻፳፮", "10000" -> "፼".
 */
export function toGeezNumber(digitStr: string): string {
  if (!digitStr || !/^\d+$/.test(digitStr)) {
    return digitStr;
  }

  // Strip leading zeros; if all zeros, return "0" (Ge'ez has no zero glyph)
  const trimmed = digitStr.replace(/^0+/, '');
  if (!trimmed) {
    return '0';
  }

  // Split into base-100 groups from right to left
  const groups: number[] = [];
  for (let i = trimmed.length; i > 0; i -= 2) {
    const start = Math.max(0, i - 2);
    groups.push(parseInt(trimmed.slice(start, i), 10));
  }

  // Process from most-significant group down to least-significant group
  let result = '';
  for (let idx = groups.length - 1; idx >= 0; idx--) {
    const val = groups[idx];
    const isMyriad = idx % 2 === 0 && idx > 0; // powers of 10,000 (፼)
    const isHundred = idx % 2 === 1;           // odd positions are 100s (፻)

    if (idx === 0) {
      if (val > 0) {
        result += formatUnder100(val);
      }
    } else if (isHundred) {
      if (val > 0) {
        const omitOne = val === 1 && idx === groups.length - 1;
        result += (omitOne ? '' : formatUnder100(val)) + '፻';
      }
    } else if (isMyriad) {
      if (val > 0) {
        const omitOne = val === 1 && idx === groups.length - 1;
        result += (omitOne ? '' : formatUnder100(val)) + '፼';
      } else {
        result += '፼';
      }
    }
  }

  return result;
}
