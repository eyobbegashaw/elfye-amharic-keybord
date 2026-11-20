#include "amharic_core.h"
#include <string.h>
#include <stdlib.h>

typedef struct {
    const char *key;
    uint32_t base;
    bool has_labial;
    uint32_t labial_override;
} ConsonantMeta;

typedef struct {
    const char *token;
    EthiopicOrder order;
} VowelToken;

typedef struct {
    const char *key;
    uint32_t codepoint;
} LoneVowelMapping;

/* Consonants ordered by length descending, then alphabetical for greedy matching */
static const ConsonantMeta CONSONANTS[] = {
    /* 2-character consonants */
    { "sh", 0x1238, true,  0 },
    { "ch", 0x1278, true,  0 },
    { "gn", 0x1298, true,  0 },
    { "kh", 0x12B8, true,  0x12C3 },
    { "zh", 0x12E0, true,  0 },
    { "ts", 0x1338, true,  0 },
    { "Ts", 0x1340, true,  0 },
    { "hh", 0x1280, true,  0x128B },

    /* 1-character consonants */
    { "b",  0x1260, true,  0 },
    { "c",  0x1278, true,  0 },
    { "C",  0x1328, true,  0 },
    { "d",  0x12F0, true,  0 },
    { "f",  0x1348, true,  0 },
    { "g",  0x1308, true,  0x1313 },
    { "h",  0x1200, true,  0x128B },
    { "H",  0x1210, false, 0 },
    { "j",  0x1300, true,  0 },
    { "k",  0x12A8, true,  0x12B3 },
    { "l",  0x1208, true,  0 },
    { "m",  0x1218, true,  0 },
    { "n",  0x1290, true,  0 },
    { "p",  0x1350, true,  0 },
    { "P",  0x1330, true,  0 },
    { "q",  0x1240, true,  0x124B },
    { "r",  0x1228, true,  0 },
    { "s",  0x1230, true,  0 },
    { "S",  0x1220, true,  0 },
    { "t",  0x1270, true,  0 },
    { "T",  0x1320, true,  0 },
    { "v",  0x1268, true,  0 },
    { "w",  0x12C8, false, 0 },
    { "x",  0x1280, true,  0x128B },
    { "y",  0x12E8, false, 0 },
    { "z",  0x12D8, true,  0 }
};
static const size_t CONSONANTS_COUNT = sizeof(CONSONANTS) / sizeof(CONSONANTS[0]);

/* Vowel suffixes ordered by length descending */
static const VowelToken VOWELS[] = {
    { "Aie", ORDER_HAMES },
    { "aie", ORDER_HAMES },
    { "ie",  ORDER_HAMES },
    { "ua",  ORDER_LABIAL },
    { "wa",  ORDER_LABIAL },
    { "e",   ORDER_GEEZ },
    { "u",   ORDER_KAEB },
    { "i",   ORDER_SALES },
    { "a",   ORDER_RABE },
    { "o",   ORDER_SABE }
};
static const size_t VOWELS_COUNT = sizeof(VOWELS) / sizeof(VOWELS[0]);

/* Pharyngeal vowels (ዐ row) ordered by length descending */
static const LoneVowelMapping PHARYNGEALS[] = {
    { "Aie", 0x12D4 },
    { "AA",  0x12D3 },
    { "Aa",  0x12D3 },
    { "EE",  0x12D4 },
    { "Ie",  0x12D4 },
    { "A",   0x12D0 },
    { "U",   0x12D1 },
    { "I",   0x12D2 },
    { "E",   0x12D5 },
    { "O",   0x12D6 }
};
static const size_t PHARYNGEALS_COUNT = sizeof(PHARYNGEALS) / sizeof(PHARYNGEALS[0]);

/* Lone vowels (አ row) ordered by length descending */
static const LoneVowelMapping LONE_VOWELS[] = {
    { "ie", 0x12A4 },
    { "aa", 0x12A3 },
    { "ea", 0x12A7 },
    { "a",  0x12A0 },
    { "u",  0x12A1 },
    { "i",  0x12A2 },
    { "e",  0x12A5 },
    { "o",  0x12A6 }
};
static const size_t LONE_VOWELS_COUNT = sizeof(LONE_VOWELS) / sizeof(LONE_VOWELS[0]);

size_t amharic_utf8_encode(uint32_t codepoint, char *out) {
    if (codepoint <= 0x7F) {
        out[0] = (char)codepoint;
        out[1] = '\0';
        return 1;
    } else if (codepoint <= 0x7FF) {
        out[0] = (char)(0xC0 | ((codepoint >> 6) & 0x1F));
        out[1] = (char)(0x80 | (codepoint & 0x3F));
        out[2] = '\0';
        return 2;
    } else if (codepoint <= 0xFFFF) {
        out[0] = (char)(0xE0 | ((codepoint >> 12) & 0x0F));
        out[1] = (char)(0x80 | ((codepoint >> 6) & 0x3F));
        out[2] = (char)(0x80 | (codepoint & 0x3F));
        out[3] = '\0';
        return 3;
    } else if (codepoint <= 0x10FFFF) {
        out[0] = (char)(0xF0 | ((codepoint >> 18) & 0x07));
        out[1] = (char)(0x80 | ((codepoint >> 12) & 0x3F));
        out[2] = (char)(0x80 | ((codepoint >> 6) & 0x3F));
        out[3] = (char)(0x80 | (codepoint & 0x3F));
        out[4] = '\0';
        return 4;
    }
    out[0] = '\0';
    return 0;
}

static uint32_t get_ethiopic_codepoint(const ConsonantMeta *meta, EthiopicOrder order) {
    if (order == ORDER_LABIAL) {
        if (!meta->has_labial) return 0;
        if (meta->labial_override != 0) return meta->labial_override;
        return meta->base + 7;
    }
    return meta->base + (uint32_t)order;
}

void amharic_default_options(TransliterationOptions *opts) {
    if (!opts) return;
    opts->escape_char = '\'';
    opts->convert_punctuation = true;
    opts->convert_digits = false;
    opts->allow_wa_for_labial = true;
}

static const char* match_punctuation(char c) {
    switch (c) {
        case ',': return "\xE1\x8D\xA3"; /* ፣ */
        case '.': return "\xE1\x8D\xA2"; /* ። */
        case ';': return "\xE1\x8D\xA4"; /* ፤ */
        case ':': return "\xE1\x8D\xA1"; /* ፡ */
        default: return NULL;
    }
}

static const char* match_digit(char c) {
    switch (c) {
        case '1': return "\xE1\x8D\xA9"; /* ፩ */
        case '2': return "\xE1\x8D\xAA"; /* ፪ */
        case '3': return "\xE1\x8D\xAB"; /* ፫ */
        case '4': return "\xE1\x8D\xAC"; /* ፬ */
        case '5': return "\xE1\x8D\xAD"; /* ፭ */
        case '6': return "\xE1\x8D\xAE"; /* ፮ */
        case '7': return "\xE1\x8D\xAF"; /* ፯ */
        case '8': return "\xE1\x8D\xB0"; /* ፰ */
        case '9': return "\xE1\x8D\xB1"; /* ፱ */
        default: return NULL;
    }
}

static bool render_buffer_internal(const char *buf, char *out, const TransliterationOptions *opts) {
    if (!buf || buf[0] == '\0') return false;

    /* 1. Consonant prefix matching */
    for (size_t i = 0; i < CONSONANTS_COUNT; i++) {
        const ConsonantMeta *c = &CONSONANTS[i];
        size_t c_len = strlen(c->key);
        if (strncmp(buf, c->key, c_len) == 0) {
            const char *rem = buf + c_len;
            if (rem[0] == '\0') {
                /* Consonant alone -> 6th order */
                uint32_t cp = get_ethiopic_codepoint(c, ORDER_SADES);
                if (cp) {
                    amharic_utf8_encode(cp, out);
                    return true;
                }
                return false;
            }

            for (size_t v = 0; v < VOWELS_COUNT; v++) {
                if (!opts->allow_wa_for_labial && strcmp(VOWELS[v].token, "wa") == 0) continue;
                if (strcmp(rem, VOWELS[v].token) == 0) {
                    uint32_t cp = get_ethiopic_codepoint(c, VOWELS[v].order);
                    if (cp) {
                        amharic_utf8_encode(cp, out);
                        return true;
                    }
                }
            }
            return false;
        }
    }

    /* 2. Pharyngeal vowels */
    for (size_t p = 0; p < PHARYNGEALS_COUNT; p++) {
        if (strcmp(buf, PHARYNGEALS[p].key) == 0) {
            amharic_utf8_encode(PHARYNGEALS[p].codepoint, out);
            return true;
        }
    }

    /* 3. Lone vowels */
    for (size_t l = 0; l < LONE_VOWELS_COUNT; l++) {
        if (strcmp(buf, LONE_VOWELS[l].key) == 0) {
            amharic_utf8_encode(LONE_VOWELS[l].codepoint, out);
            return true;
        }
    }

    return false;
}

size_t amharic_transliterate(const char *input, char *output, size_t out_max, const TransliterationOptions *opts) {
    if (!input || !output || out_max == 0) return 0;

    TransliterationOptions default_opts;
    if (!opts) {
        amharic_default_options(&default_opts);
        opts = &default_opts;
    }

    size_t in_len = strlen(input);
    size_t out_pos = 0;
    size_t i = 0;
    char esc = opts->escape_char;

    while (i < in_len && out_pos + 4 < out_max) {
        /* 1. Double escape -> literal escape */
        if (input[i] == esc && i + 1 < in_len && input[i + 1] == esc) {
            output[out_pos++] = esc;
            i += 2;
            continue;
        }

        /* 2. Single escape -> advance */
        if (input[i] == esc) {
            i++;
            continue;
        }

        /* 3. Punctuation */
        if (opts->convert_punctuation) {
            const char *p = match_punctuation(input[i]);
            if (p) {
                size_t p_len = strlen(p);
                if (out_pos + p_len < out_max) {
                    memcpy(output + out_pos, p, p_len);
                    out_pos += p_len;
                }
                i++;
                continue;
            }
        }

        /* 4. Digits */
        if (opts->convert_digits) {
            const char *d = match_digit(input[i]);
            if (d) {
                size_t d_len = strlen(d);
                if (out_pos + d_len < out_max) {
                    memcpy(output + out_pos, d, d_len);
                    out_pos += d_len;
                }
                i++;
                continue;
            }
        }

        const char *rem = input + i;

        /* 5. Consonants */
        const ConsonantMeta *matched_c = NULL;
        for (size_t c_idx = 0; c_idx < CONSONANTS_COUNT; c_idx++) {
            size_t c_len = strlen(CONSONANTS[c_idx].key);
            if (strncmp(rem, CONSONANTS[c_idx].key, c_len) == 0) {
                matched_c = &CONSONANTS[c_idx];
                break;
            }
        }

        if (matched_c) {
            size_t c_len = strlen(matched_c->key);

            /* Followed by escape? */
            if (i + c_len < in_len && input[i + c_len] == esc) {
                uint32_t cp = get_ethiopic_codepoint(matched_c, ORDER_SADES);
                char utf[5];
                size_t u_len = amharic_utf8_encode(cp, utf);
                if (out_pos + u_len < out_max) {
                    memcpy(output + out_pos, utf, u_len);
                    out_pos += u_len;
                }
                i += c_len + 1;
                continue;
            }

            /* Followed by vowel? */
            const char *after_c = rem + c_len;
            const VowelToken *matched_v = NULL;
            for (size_t v_idx = 0; v_idx < VOWELS_COUNT; v_idx++) {
                if (!opts->allow_wa_for_labial && strcmp(VOWELS[v_idx].token, "wa") == 0) continue;
                size_t v_len = strlen(VOWELS[v_idx].token);
                if (strncmp(after_c, VOWELS[v_idx].token, v_len) == 0) {
                    matched_v = &VOWELS[v_idx];
                    break;
                }
            }

            if (matched_v) {
                uint32_t cp = get_ethiopic_codepoint(matched_c, matched_v->order);
                if (cp) {
                    char utf[5];
                    size_t u_len = amharic_utf8_encode(cp, utf);
                    if (out_pos + u_len < out_max) {
                        memcpy(output + out_pos, utf, u_len);
                        out_pos += u_len;
                    }
                    i += c_len + strlen(matched_v->token);
                    continue;
                }
            }

            /* No vowel matched: 6th order */
            uint32_t cp = get_ethiopic_codepoint(matched_c, ORDER_SADES);
            char utf[5];
            size_t u_len = amharic_utf8_encode(cp, utf);
            if (out_pos + u_len < out_max) {
                memcpy(output + out_pos, utf, u_len);
                out_pos += u_len;
            }
            i += c_len;
            continue;
        }

        /* 6. Pharyngeal lone vowels */
        const LoneVowelMapping *matched_p = NULL;
        for (size_t p_idx = 0; p_idx < PHARYNGEALS_COUNT; p_idx++) {
            size_t p_len = strlen(PHARYNGEALS[p_idx].key);
            if (strncmp(rem, PHARYNGEALS[p_idx].key, p_len) == 0) {
                matched_p = &PHARYNGEALS[p_idx];
                break;
            }
        }
        if (matched_p) {
            char utf[5];
            size_t u_len = amharic_utf8_encode(matched_p->codepoint, utf);
            if (out_pos + u_len < out_max) {
                memcpy(output + out_pos, utf, u_len);
                out_pos += u_len;
            }
            i += strlen(matched_p->key);
            continue;
        }

        /* 7. Lone vowels */
        const LoneVowelMapping *matched_l = NULL;
        for (size_t l_idx = 0; l_idx < LONE_VOWELS_COUNT; l_idx++) {
            size_t l_len = strlen(LONE_VOWELS[l_idx].key);
            if (strncmp(rem, LONE_VOWELS[l_idx].key, l_len) == 0) {
                matched_l = &LONE_VOWELS[l_idx];
                break;
            }
        }
        if (matched_l) {
            char utf[5];
            size_t u_len = amharic_utf8_encode(matched_l->codepoint, utf);
            if (out_pos + u_len < out_max) {
                memcpy(output + out_pos, utf, u_len);
                out_pos += u_len;
            }
            i += strlen(matched_l->key);
            continue;
        }

        /* 8. Other character pass-through */
        output[out_pos++] = input[i++];
    }

    output[out_pos] = '\0';
    return out_pos;
}

void amharic_engine_init(LiveTypingEngine *engine, const TransliterationOptions *opts) {
    if (!engine) return;
    engine->buffer[0] = '\0';
    if (opts) {
        engine->options = *opts;
    } else {
        amharic_default_options(&engine->options);
    }
}

EngineResult amharic_engine_input(LiveTypingEngine *engine, const char *text) {
    EngineResult result;
    result.committed[0] = '\0';
    result.composing[0] = '\0';
    if (!engine || !text || text[0] == '\0') return result;

    for (size_t idx = 0; text[idx] != '\0'; idx++) {
        char ch = text[idx];
        char esc = engine->options.escape_char;

        /* 1. Escape */
        if (ch == esc) {
            if (engine->buffer[0] != '\0') {
                char rendered[16] = {0};
                if (render_buffer_internal(engine->buffer, rendered, &engine->options)) {
                    strncat(result.committed, rendered, sizeof(result.committed) - strlen(result.committed) - 1);
                } else {
                    strncat(result.committed, engine->buffer, sizeof(result.committed) - strlen(result.committed) - 1);
                }
                engine->buffer[0] = '\0';
            }
            continue;
        }

        /* 2. Whitespace */
        if (ch == ' ' || ch == '\n' || ch == '\r' || ch == '\t') {
            if (engine->buffer[0] != '\0') {
                char rendered[16] = {0};
                if (render_buffer_internal(engine->buffer, rendered, &engine->options)) {
                    strncat(result.committed, rendered, sizeof(result.committed) - strlen(result.committed) - 1);
                } else {
                    strncat(result.committed, engine->buffer, sizeof(result.committed) - strlen(result.committed) - 1);
                }
                engine->buffer[0] = '\0';
            }
            char ws[2] = { ch, '\0' };
            strncat(result.committed, ws, sizeof(result.committed) - strlen(result.committed) - 1);
            continue;
        }

        /* 3. Punctuation */
        if (engine->options.convert_punctuation) {
            const char *p = match_punctuation(ch);
            if (p) {
                if (engine->buffer[0] != '\0') {
                    char rendered[16] = {0};
                    if (render_buffer_internal(engine->buffer, rendered, &engine->options)) {
                        strncat(result.committed, rendered, sizeof(result.committed) - strlen(result.committed) - 1);
                    } else {
                        strncat(result.committed, engine->buffer, sizeof(result.committed) - strlen(result.committed) - 1);
                    }
                    engine->buffer[0] = '\0';
                }
                strncat(result.committed, p, sizeof(result.committed) - strlen(result.committed) - 1);
                continue;
            }
        }

        /* 4. Digits */
        if (engine->options.convert_digits) {
            const char *d = match_digit(ch);
            if (d) {
                if (engine->buffer[0] != '\0') {
                    char rendered[16] = {0};
                    if (render_buffer_internal(engine->buffer, rendered, &engine->options)) {
                        strncat(result.committed, rendered, sizeof(result.committed) - strlen(result.committed) - 1);
                    } else {
                        strncat(result.committed, engine->buffer, sizeof(result.committed) - strlen(result.committed) - 1);
                    }
                    engine->buffer[0] = '\0';
                }
                strncat(result.committed, d, sizeof(result.committed) - strlen(result.committed) - 1);
                continue;
            }
        }

        /* 5. Syllable candidate */
        char candidate[32];
        strncpy(candidate, engine->buffer, sizeof(candidate) - 2);
        candidate[sizeof(candidate) - 2] = '\0';
        size_t cand_len = strlen(candidate);
        candidate[cand_len] = ch;
        candidate[cand_len + 1] = '\0';

        char rendered[16] = {0};
        if (render_buffer_internal(candidate, rendered, &engine->options)) {
            strcpy(engine->buffer, candidate);
            strcpy(result.composing, rendered);
            continue;
        }

        /* Candidate doesn't match continuation. Commit previous buffer */
        if (engine->buffer[0] != '\0') {
            char prev_rendered[16] = {0};
            if (render_buffer_internal(engine->buffer, prev_rendered, &engine->options)) {
                strncat(result.committed, prev_rendered, sizeof(result.committed) - strlen(result.committed) - 1);
            } else {
                strncat(result.committed, engine->buffer, sizeof(result.committed) - strlen(result.committed) - 1);
            }
            engine->buffer[0] = '\0';
        }

        /* Check if single char starts a new syllable */
        char single_str[2] = { ch, '\0' };
        char single_rendered[16] = {0};
        if (render_buffer_internal(single_str, single_rendered, &engine->options)) {
            strcpy(engine->buffer, single_str);
            strcpy(result.composing, single_rendered);
            continue;
        }

        /* Pass-through unmapped char as committed */
        strncat(result.committed, single_str, sizeof(result.committed) - strlen(result.committed) - 1);
    }

    return result;
}

EngineResult amharic_engine_backspace(LiveTypingEngine *engine) {
    EngineResult result;
    result.committed[0] = '\0';
    result.composing[0] = '\0';
    if (!engine || engine->buffer[0] == '\0') return result;

    size_t len = strlen(engine->buffer);
    engine->buffer[len - 1] = '\0';

    if (engine->buffer[0] != '\0') {
        char rendered[16] = {0};
        if (render_buffer_internal(engine->buffer, rendered, &engine->options)) {
            strcpy(result.composing, rendered);
        }
    }
    return result;
}

void amharic_engine_reset(LiveTypingEngine *engine) {
    if (engine) engine->buffer[0] = '\0';
}

void amharic_engine_commit_current(LiveTypingEngine *engine, char *out, size_t out_max) {
    if (!out || out_max == 0) return;
    out[0] = '\0';
    if (!engine || engine->buffer[0] == '\0') return;

    char rendered[16] = {0};
    if (render_buffer_internal(engine->buffer, rendered, &engine->options)) {
        strncpy(out, rendered, out_max - 1);
        out[out_max - 1] = '\0';
    } else {
        strncpy(out, engine->buffer, out_max - 1);
        out[out_max - 1] = '\0';
    }
    engine->buffer[0] = '\0';
}

const char* amharic_engine_get_buffer(const LiveTypingEngine *engine) {
    return engine ? engine->buffer : "";
}

void amharic_engine_get_composing(const LiveTypingEngine *engine, char *out, size_t out_max) {
    if (!out || out_max == 0) return;
    out[0] = '\0';
    if (!engine || engine->buffer[0] == '\0') return;

    char rendered[16] = {0};
    if (render_buffer_internal(engine->buffer, rendered, &engine->options)) {
        strncpy(out, rendered, out_max - 1);
        out[out_max - 1] = '\0';
    }
}
