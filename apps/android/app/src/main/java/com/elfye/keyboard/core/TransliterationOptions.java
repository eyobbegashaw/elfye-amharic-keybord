package com.elfye.keyboard.core;

/**
 * Configuration options for Addiyon phonetic transliteration.
 */
public class TransliterationOptions {
    private char escapeChar = '\'';
    private boolean convertPunctuation = true;
    private boolean convertDigits = false;
    private boolean allowWaForLabial = true;
    private boolean enableSeraAliases = false;

    public char getEscapeChar() {
        return escapeChar;
    }

    public TransliterationOptions setEscapeChar(char escapeChar) {
        this.escapeChar = escapeChar;
        return this;
    }

    public boolean isConvertPunctuation() {
        return convertPunctuation;
    }

    public TransliterationOptions setConvertPunctuation(boolean convertPunctuation) {
        this.convertPunctuation = convertPunctuation;
        return this;
    }

    public boolean isConvertDigits() {
        return convertDigits;
    }

    public TransliterationOptions setConvertDigits(boolean convertDigits) {
        this.convertDigits = convertDigits;
        return this;
    }

    public boolean isAllowWaForLabial() {
        return allowWaForLabial;
    }

    public TransliterationOptions setAllowWaForLabial(boolean allowWaForLabial) {
        this.allowWaForLabial = allowWaForLabial;
        return this;
    }

    public boolean isEnableSeraAliases() {
        return enableSeraAliases;
    }

    public TransliterationOptions setEnableSeraAliases(boolean enableSeraAliases) {
        this.enableSeraAliases = enableSeraAliases;
        return this;
    }
}
