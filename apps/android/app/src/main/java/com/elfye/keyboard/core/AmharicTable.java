package com.elfye.keyboard.core;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Compiled Addiyon phonetic rule tables for Ethiopic script transliteration.
 * Mirrors packages/core/src/constants.ts and table.ts identically.
 */
public final class AmharicTable {

    public enum EthiopicOrder {
        GEEZ(0),   // 1st (e)
        KAEB(1),   // 2nd (u)
        SALES(2),  // 3rd (i)
        RABE(3),   // 4th (a)
        HAMES(4),  // 5th (ie)
        SADES(5),  // 6th (bare consonant)
        SABE(6),   // 7th (o)
        LABIAL(7); // 8th (ua/wa)

        public final int offset;

        EthiopicOrder(int offset) {
            this.offset = offset;
        }
    }

    public static final class ConsonantMeta {
        public final int base;
        public final boolean hasLabial;
        public final int labialOverride; // -1 if none

        public ConsonantMeta(int base, boolean hasLabial, int labialOverride) {
            this.base = base;
            this.hasLabial = hasLabial;
            this.labialOverride = labialOverride;
        }

        public ConsonantMeta(int base, boolean hasLabial) {
            this(base, hasLabial, -1);
        }
    }

    private static final Map<String, ConsonantMeta> BASE_CONSONANTS = new HashMap<>();
    private static final Map<String, String> BASE_LONE_VOWELS = new HashMap<>();
    private static final Map<String, String> BASE_PHARYNGEAL_VOWELS = new HashMap<>();
    private static final Map<Character, String> BASE_PUNCTUATION = new HashMap<>();
    private static final Map<Character, String> BASE_DIGITS = new HashMap<>();

    static {
        // Digraphs
        BASE_CONSONANTS.put("sh", new ConsonantMeta(0x1238, true));
        BASE_CONSONANTS.put("ch", new ConsonantMeta(0x1278, true));
        BASE_CONSONANTS.put("gn", new ConsonantMeta(0x1298, true));
        BASE_CONSONANTS.put("kh", new ConsonantMeta(0x12B8, true, 0x12C3));
        BASE_CONSONANTS.put("zh", new ConsonantMeta(0x12E0, true));
        BASE_CONSONANTS.put("ts", new ConsonantMeta(0x1338, true));
        BASE_CONSONANTS.put("Ts", new ConsonantMeta(0x1340, true));
        BASE_CONSONANTS.put("hh", new ConsonantMeta(0x1280, true, 0x128B));

        // Single-letter consonants
        BASE_CONSONANTS.put("h", new ConsonantMeta(0x1200, true, 0x128B));
        BASE_CONSONANTS.put("l", new ConsonantMeta(0x1208, true));
        BASE_CONSONANTS.put("H", new ConsonantMeta(0x1210, false));
        BASE_CONSONANTS.put("m", new ConsonantMeta(0x1218, true));
        BASE_CONSONANTS.put("S", new ConsonantMeta(0x1220, true));
        BASE_CONSONANTS.put("r", new ConsonantMeta(0x1228, true));
        BASE_CONSONANTS.put("s", new ConsonantMeta(0x1230, true));
        BASE_CONSONANTS.put("q", new ConsonantMeta(0x1240, true, 0x124B));
        BASE_CONSONANTS.put("b", new ConsonantMeta(0x1260, true));
        BASE_CONSONANTS.put("v", new ConsonantMeta(0x1268, true));
        BASE_CONSONANTS.put("t", new ConsonantMeta(0x1270, true));
        BASE_CONSONANTS.put("c", new ConsonantMeta(0x1278, true));
        BASE_CONSONANTS.put("n", new ConsonantMeta(0x1290, true));
        BASE_CONSONANTS.put("k", new ConsonantMeta(0x12A8, true, 0x12B3));
        BASE_CONSONANTS.put("w", new ConsonantMeta(0x12C8, false));
        BASE_CONSONANTS.put("z", new ConsonantMeta(0x12D8, true));
        BASE_CONSONANTS.put("y", new ConsonantMeta(0x12E8, false));
        BASE_CONSONANTS.put("d", new ConsonantMeta(0x12F0, true));
        BASE_CONSONANTS.put("j", new ConsonantMeta(0x1300, true));
        BASE_CONSONANTS.put("g", new ConsonantMeta(0x1308, true, 0x1313));
        BASE_CONSONANTS.put("T", new ConsonantMeta(0x1320, true));
        BASE_CONSONANTS.put("C", new ConsonantMeta(0x1328, true));
        BASE_CONSONANTS.put("P", new ConsonantMeta(0x1330, true));
        BASE_CONSONANTS.put("f", new ConsonantMeta(0x1348, true));
        BASE_CONSONANTS.put("p", new ConsonantMeta(0x1350, true));
        BASE_CONSONANTS.put("x", new ConsonantMeta(0x1280, true, 0x128B));

        // Lone vowels (አ row)
        BASE_LONE_VOWELS.put("ie", "\u12A4");
        BASE_LONE_VOWELS.put("aa", "\u12A3");
        BASE_LONE_VOWELS.put("ea", "\u12A7");
        BASE_LONE_VOWELS.put("a", "\u12A0");
        BASE_LONE_VOWELS.put("u", "\u12A1");
        BASE_LONE_VOWELS.put("i", "\u12A2");
        BASE_LONE_VOWELS.put("e", "\u12A5");
        BASE_LONE_VOWELS.put("o", "\u12A6");

        // Pharyngeal vowels (ዐ row)
        BASE_PHARYNGEAL_VOWELS.put("Aie", "\u12D4");
        BASE_PHARYNGEAL_VOWELS.put("AA", "\u12D3");
        BASE_PHARYNGEAL_VOWELS.put("Aa", "\u12D3");
        BASE_PHARYNGEAL_VOWELS.put("EE", "\u12D4");
        BASE_PHARYNGEAL_VOWELS.put("Ie", "\u12D4");
        BASE_PHARYNGEAL_VOWELS.put("A", "\u12D0");
        BASE_PHARYNGEAL_VOWELS.put("U", "\u12D1");
        BASE_PHARYNGEAL_VOWELS.put("I", "\u12D2");
        BASE_PHARYNGEAL_VOWELS.put("E", "\u12D5");
        BASE_PHARYNGEAL_VOWELS.put("O", "\u12D6");

        // Punctuation
        BASE_PUNCTUATION.put(',', "\u1363"); // ፣
        BASE_PUNCTUATION.put('.', "\u1362"); // ።
        BASE_PUNCTUATION.put(';', "\u1364"); // ፤
        BASE_PUNCTUATION.put(':', "\u1361"); // ፡

        // Ethiopic digits
        BASE_DIGITS.put('1', "\u1369");
        BASE_DIGITS.put('2', "\u136A");
        BASE_DIGITS.put('3', "\u136B");
        BASE_DIGITS.put('4', "\u136C");
        BASE_DIGITS.put('5', "\u136D");
        BASE_DIGITS.put('6', "\u136E");
        BASE_DIGITS.put('7', "\u136F");
        BASE_DIGITS.put('8', "\u1370");
        BASE_DIGITS.put('9', "\u1371");
    }

    public final Map<String, ConsonantMeta> consonants;
    public final List<String> sortedConsonantKeys;
    public final Map<String, EthiopicOrder> vowelMap;
    public final List<String> sortedVowelKeys;
    public final Map<String, String> loneVowels;
    public final List<String> sortedLoneVowelKeys;
    public final Map<String, String> pharyngealVowels;
    public final List<String> sortedPharyngealKeys;
    public final Map<Character, String> punctuation;
    public final Map<Character, String> digits;
    public final char escapeChar;

    public AmharicTable(TransliterationOptions options) {
        TransliterationOptions opts = options != null ? options : new TransliterationOptions();
        this.escapeChar = opts.getEscapeChar();

        this.consonants = Collections.unmodifiableMap(new HashMap<>(BASE_CONSONANTS));
        this.sortedConsonantKeys = sortKeysLongestFirst(this.consonants.keySet());

        Map<String, EthiopicOrder> vMap = new HashMap<>();
        vMap.put("ie", EthiopicOrder.HAMES);
        vMap.put("ua", EthiopicOrder.LABIAL);
        vMap.put("e", EthiopicOrder.GEEZ);
        vMap.put("u", EthiopicOrder.KAEB);
        vMap.put("i", EthiopicOrder.SALES);
        vMap.put("a", EthiopicOrder.RABE);
        vMap.put("o", EthiopicOrder.SABE);

        if (opts.isAllowWaForLabial()) {
            vMap.put("wa", EthiopicOrder.LABIAL);
        }
        if (opts.isEnableSeraAliases()) {
            vMap.put("ee", EthiopicOrder.HAMES);
            vMap.put("E", EthiopicOrder.HAMES);
        }

        this.vowelMap = Collections.unmodifiableMap(vMap);
        this.sortedVowelKeys = sortKeysLongestFirst(this.vowelMap.keySet());

        this.loneVowels = Collections.unmodifiableMap(new HashMap<>(BASE_LONE_VOWELS));
        this.sortedLoneVowelKeys = sortKeysLongestFirst(this.loneVowels.keySet());

        this.pharyngealVowels = Collections.unmodifiableMap(new HashMap<>(BASE_PHARYNGEAL_VOWELS));
        this.sortedPharyngealKeys = sortKeysLongestFirst(this.pharyngealVowels.keySet());

        this.punctuation = opts.isConvertPunctuation()
                ? Collections.unmodifiableMap(new HashMap<>(BASE_PUNCTUATION))
                : Collections.emptyMap();

        this.digits = opts.isConvertDigits()
                ? Collections.unmodifiableMap(new HashMap<>(BASE_DIGITS))
                : Collections.emptyMap();
    }

    private static List<String> sortKeysLongestFirst(Iterable<String> keys) {
        List<String> list = new ArrayList<>();
        for (String k : keys) {
            list.add(k);
        }
        list.sort(Comparator.comparingInt(String::length).reversed().thenComparing(Comparator.naturalOrder()));
        return Collections.unmodifiableList(list);
    }

    public static String getEthiopicChar(ConsonantMeta meta, EthiopicOrder order) {
        if (meta == null || order == null) {
            return null;
        }
        if (order == EthiopicOrder.LABIAL) {
            if (!meta.hasLabial) {
                return null;
            }
            int cp = meta.labialOverride != -1 ? meta.labialOverride : (meta.base + 7);
            return new String(Character.toChars(cp));
        }
        return new String(Character.toChars(meta.base + order.offset));
    }
}
