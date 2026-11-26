package com.elfye.keyboard.core;

/**
 * Stateful live typing engine for Android IME composition & progressive backspace.
 * Mirrors packages/core/src/engine.ts identically.
 */
public class LiveTypingEngine {
    private final AmharicTable table;
    private String buffer = "";
    private final StringBuilder fullCommitted = new StringBuilder();

    public LiveTypingEngine() {
        this(new TransliterationOptions());
    }

    public LiveTypingEngine(TransliterationOptions options) {
        this.table = new AmharicTable(options);
    }

    public EngineResult input(char ch) {
        return inputSingle(ch);
    }

    public EngineResult input(String text) {
        if (text == null || text.isEmpty()) {
            return new EngineResult("", getComposing());
        }
        StringBuilder committed = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            EngineResult res = inputSingle(text.charAt(i));
            committed.append(res.committed);
        }
        return new EngineResult(committed.toString(), getComposing());
    }

    private EngineResult inputSingle(char ch) {
        // 1. Escape char commits active buffer and clears it
        if (ch == table.escapeChar) {
            if (!buffer.isEmpty()) {
                String committedText = renderBuffer(buffer);
                if (committedText == null) committedText = buffer;
                buffer = "";
                fullCommitted.append(committedText);
                return new EngineResult(committedText, "");
            }
            return new EngineResult("", "");
        }

        // 2. Whitespace commits buffer + whitespace
        if (ch == ' ' || ch == '\n' || ch == '\r' || ch == '\t') {
            String pending = !buffer.isEmpty() ? renderBuffer(buffer) : "";
            if (pending == null) pending = buffer;
            buffer = "";
            String committed = pending + ch;
            fullCommitted.append(committed);
            return new EngineResult(committed, "");
        }

        // 3. Punctuation
        String punct = table.punctuation.get(ch);
        if (punct != null) {
            String pending = !buffer.isEmpty() ? renderBuffer(buffer) : "";
            if (pending == null) pending = buffer;
            buffer = "";
            String committed = pending + punct;
            fullCommitted.append(committed);
            return new EngineResult(committed, "");
        }

        // 4. Digits
        String digit = table.digits.get(ch);
        if (digit != null) {
            String pending = !buffer.isEmpty() ? renderBuffer(buffer) : "";
            if (pending == null) pending = buffer;
            buffer = "";
            String committed = pending + digit;
            fullCommitted.append(committed);
            return new EngineResult(committed, "");
        }

        // 5. Latin letter input
        String candidate = buffer + ch;
        String candidateRender = renderBuffer(candidate);
        if (candidateRender != null) {
            buffer = candidate;
            return new EngineResult("", candidateRender);
        }

        // Commit previous buffer, then check if ch starts a new syllable
        String committedPrev = !buffer.isEmpty() ? renderBuffer(buffer) : "";
        if (committedPrev == null) committedPrev = buffer;
        fullCommitted.append(committedPrev);

        String singleStr = String.valueOf(ch);
        String singleRender = renderBuffer(singleStr);
        if (singleRender != null) {
            buffer = singleStr;
            return new EngineResult(committedPrev, singleRender);
        }

        buffer = "";
        String committed = committedPrev + ch;
        fullCommitted.append(ch);
        return new EngineResult(committed, "");
    }

    public EngineResult backspace() {
        if (buffer.isEmpty()) {
            return new EngineResult("", "");
        }
        buffer = buffer.substring(0, buffer.length() - 1);
        if (buffer.isEmpty()) {
            return new EngineResult("", "");
        }
        String composing = renderBuffer(buffer);
        return new EngineResult("", composing != null ? composing : "");
    }

    public void reset() {
        buffer = "";
    }

    public String commitCurrent() {
        if (buffer.isEmpty()) {
            return "";
        }
        String committed = renderBuffer(buffer);
        if (committed == null) committed = "";
        buffer = "";
        fullCommitted.append(committed);
        return committed;
    }

    public String getComposing() {
        if (buffer.isEmpty()) return "";
        String res = renderBuffer(buffer);
        return res != null ? res : "";
    }

    public String getBuffer() {
        return buffer;
    }

    public boolean isComposing() {
        return !buffer.isEmpty();
    }

    public String getText() {
        return fullCommitted.toString() + getComposing();
    }

    /**
     * Renders buf only if the ENTIRE buffer forms a single valid syllable or prefix.
     * Returns null if buf spans multiple syllables or is invalid.
     */
    private String renderBuffer(String buf) {
        if (buf.isEmpty()) return null;

        // 1. Check consonants
        for (String cKey : table.sortedConsonantKeys) {
            if (buf.equals(cKey)) {
                return AmharicTable.getEthiopicChar(table.consonants.get(cKey), AmharicTable.EthiopicOrder.SADES);
            }
            if (buf.startsWith(cKey)) {
                String rest = buf.substring(cKey.length());
                AmharicTable.EthiopicOrder ord = table.vowelMap.get(rest);
                if (ord != null) {
                    return AmharicTable.getEthiopicChar(table.consonants.get(cKey), ord);
                }
                return null;
            }
        }

        // 2. Pharyngeal lone vowels
        String pharyngeal = table.pharyngealVowels.get(buf);
        if (pharyngeal != null) return pharyngeal;

        // 3. Standard lone vowels
        String lone = table.loneVowels.get(buf);
        if (lone != null) return lone;

        return null;
    }
}
