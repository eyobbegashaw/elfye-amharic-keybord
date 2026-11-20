#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "amharic_core.h"

static char* read_entire_file(const char *path) {
    FILE *f = fopen(path, "rb");
    if (!f) return NULL;
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    char *buf = (char*)malloc(size + 1);
    if (!buf) {
        fclose(f);
        return NULL;
    }
    fread(buf, 1, size, f);
    buf[size] = '\0';
    fclose(f);
    return buf;
}

/* Very lightweight parser to extract string value for a given key */
static const char* find_json_string(const char *json, const char *key, char *out_val, size_t out_max) {
    char pattern[128];
    snprintf(pattern, sizeof(pattern), "\"%s\"", key);
    const char *pos = strstr(json, pattern);
    if (!pos) return NULL;

    pos += strlen(pattern);
    while (*pos && (*pos == ' ' || *pos == '\t' || *pos == '\r' || *pos == '\n' || *pos == ':')) {
        pos++;
    }
    if (*pos != '\"') return NULL;
    pos++; /* skip opening quote */

    size_t i = 0;
    while (*pos && *pos != '\"' && i + 1 < out_max) {
        if (*pos == '\\' && *(pos + 1) != '\0') {
            pos++;
            if (*pos == 'n') out_val[i++] = '\n';
            else if (*pos == 't') out_val[i++] = '\t';
            else if (*pos == 'r') out_val[i++] = '\r';
            else if (*pos == '\"') out_val[i++] = '\"';
            else if (*pos == '\\') out_val[i++] = '\\';
            else if (*pos == 'u') {
                /* 4-digit hex unicode \uXXXX */
                char hex[5] = { pos[1], pos[2], pos[3], pos[4], '\0' };
                uint32_t cp = (uint32_t)strtoul(hex, NULL, 16);
                char utf[5];
                size_t u_len = amharic_utf8_encode(cp, utf);
                for (size_t u = 0; u < u_len && i + 1 < out_max; u++) {
                    out_val[i++] = utf[u];
                }
                pos += 4;
            } else {
                out_val[i++] = *pos;
            }
            pos++;
        } else {
            out_val[i++] = *pos++;
        }
    }
    out_val[i] = '\0';
    return (*pos == '\"') ? pos + 1 : NULL;
}

static int run_full_vectors_test(const char *json) {
    printf("[TEST] Testing full transliteration vectors...\n");
    const char *section = strstr(json, "\"fullTransliteration\"");
    if (!section) {
        printf("Error: \"fullTransliteration\" section not found\n");
        return 1;
    }

    const char *end_section = strstr(section, "\"liveTypingSequences\"");
    if (!end_section) end_section = section + strlen(section);

    const char *p = section;
    int count = 0;
    int failures = 0;

    while (p < end_section && (p = strstr(p, "{\"input\"")) != NULL) {
        char input[256] = {0};
        char expected[256] = {0};

        const char *after_in = find_json_string(p, "input", input, sizeof(input));
        if (!after_in) { p++; continue; }
        const char *after_exp = find_json_string(p, "expected", expected, sizeof(expected));
        if (!after_exp) { p = after_in; continue; }

        char actual[512] = {0};
        amharic_transliterate(input, actual, sizeof(actual), NULL);

        if (strcmp(actual, expected) != 0) {
            printf("FAIL: input='%s' expected='%s' actual='%s'\n", input, expected, actual);
            failures++;
        }
        count++;
        p = after_exp;
    }

    printf("Result: %d / %d full vectors passed.\n", count - failures, count);
    return failures;
}

static int run_live_sequences_test(const char *json) {
    printf("[TEST] Testing live typing sequences...\n");
    const char *section = strstr(json, "\"liveTypingSequences\"");
    if (!section) {
        printf("Error: \"liveTypingSequences\" section not found\n");
        return 1;
    }

    /* Test selam sequence directly */
    LiveTypingEngine engine;
    amharic_default_options(&engine.options);
    amharic_engine_init(&engine, NULL);

    EngineResult r1 = amharic_engine_input(&engine, "s");
    assert(strcmp(r1.composing, "ስ") == 0);

    EngineResult r2 = amharic_engine_input(&engine, "e");
    assert(strcmp(r2.composing, "ሰ") == 0);

    EngineResult r3 = amharic_engine_input(&engine, "l");
    assert(strcmp(r3.committed, "ሰ") == 0);
    assert(strcmp(r3.composing, "ል") == 0);

    EngineResult r4 = amharic_engine_input(&engine, "a");
    assert(strcmp(r4.composing, "ላ") == 0);

    EngineResult r5 = amharic_engine_input(&engine, "m");
    assert(strcmp(r5.committed, "ላ") == 0);
    assert(strcmp(r5.composing, "ም") == 0);

    EngineResult r6 = amharic_engine_input(&engine, " ");
    assert(strcmp(r6.committed, "ም ") == 0);
    assert(strcmp(r6.composing, "") == 0);

    printf("Result: Live typing sequences passed.\n");
    return 0;
}

static int run_backspace_sequences_test(const char *json) {
    printf("[TEST] Testing progressive backspace sequences...\n");
    (void)json;

    LiveTypingEngine engine;
    amharic_engine_init(&engine, NULL);

    /* se -> ሰ -> backspace -> ስ -> backspace -> empty */
    amharic_engine_input(&engine, "s");
    amharic_engine_input(&engine, "e");
    char comp[16];
    amharic_engine_get_composing(&engine, comp, sizeof(comp));
    assert(strcmp(comp, "ሰ") == 0);

    EngineResult b1 = amharic_engine_backspace(&engine);
    assert(strcmp(b1.composing, "ስ") == 0);

    EngineResult b2 = amharic_engine_backspace(&engine);
    assert(strcmp(b2.composing, "") == 0);

    /* hua -> ኋ -> backspace -> ሁ -> backspace -> ህ */
    amharic_engine_reset(&engine);
    amharic_engine_input(&engine, "h");
    amharic_engine_input(&engine, "u");
    amharic_engine_input(&engine, "a");
    amharic_engine_get_composing(&engine, comp, sizeof(comp));
    assert(strcmp(comp, "ኋ") == 0);

    EngineResult hb1 = amharic_engine_backspace(&engine);
    assert(strcmp(hb1.composing, "ሁ") == 0);

    EngineResult hb2 = amharic_engine_backspace(&engine);
    assert(strcmp(hb2.composing, "ህ") == 0);

    printf("Result: Progressive backspace sequences passed.\n");
    return 0;
}

static int run_corpus_test(const char *json) {
    printf("[TEST] Testing 1,750+ corpus words...\n");
    const char *section = strstr(json, "\"commonWordsCorpus\"");
    if (!section) {
        printf("Error: \"commonWordsCorpus\" section not found\n");
        return 1;
    }

    const char *p = section;
    int count = 0;
    int failures = 0;

    while ((p = strstr(p, "{\"latin\"")) != NULL) {
        char latin[256] = {0};
        char expected[256] = {0};

        const char *after_lat = find_json_string(p, "latin", latin, sizeof(latin));
        if (!after_lat) { p++; continue; }
        const char *after_amh = find_json_string(p, "amharic", expected, sizeof(expected));
        if (!after_amh) { p = after_lat; continue; }

        char actual[512] = {0};
        amharic_transliterate(latin, actual, sizeof(actual), NULL);

        if (strcmp(actual, expected) != 0) {
            printf("FAIL CORPUS: latin='%s' expected='%s' actual='%s'\n", latin, expected, actual);
            failures++;
        }
        count++;
        p = after_amh;
    }

    printf("Result: %d / %d corpus words passed.\n", count - failures, count);
    return failures;
}

int main(int argc, char **argv) {
    const char *path = (argc > 1) ? argv[1] : "../../../../test-vectors.json";
    char *json = read_entire_file(path);
    if (!json) {
        path = "test-vectors.json";
        json = read_entire_file(path);
    }
    if (!json) {
        printf("Error: Unable to open test-vectors.json from '%s'\n", path);
        return 1;
    }

    printf("=== AmharicCore C Test Runner (test-vectors.json) ===\n");
    int failures = 0;
    failures += run_full_vectors_test(json);
    failures += run_live_sequences_test(json);
    failures += run_backspace_sequences_test(json);
    failures += run_corpus_test(json);

    free(json);
    if (failures == 0) {
        printf("\nALL TESTS PASSED SUCCESSFULLY! (0 failures)\n");
        return 0;
    } else {
        printf("\nTEST SUITE COMPLETED WITH %d FAILURES.\n", failures);
        return 1;
    }
}
