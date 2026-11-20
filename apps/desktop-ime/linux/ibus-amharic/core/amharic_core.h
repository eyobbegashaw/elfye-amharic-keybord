#ifndef AMHARIC_CORE_H
#define AMHARIC_CORE_H

#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    ORDER_GEEZ = 0,   /* 1st (e) */
    ORDER_KAEB = 1,   /* 2nd (u) */
    ORDER_SALES = 2,  /* 3rd (i) */
    ORDER_RABE = 3,   /* 4th (a) */
    ORDER_HAMES = 4,  /* 5th (ie) */
    ORDER_SADES = 5,  /* 6th (consonant alone) */
    ORDER_SABE = 6,   /* 7th (o) */
    ORDER_LABIAL = 7  /* 8th (ua/wa) */
} EthiopicOrder;

typedef struct {
    char committed[64];
    char composing[64];
} EngineResult;

typedef struct {
    char escape_char;
    bool convert_punctuation;
    bool convert_digits;
    bool allow_wa_for_labial;
} TransliterationOptions;

typedef struct {
    char buffer[32];
    TransliterationOptions options;
} LiveTypingEngine;

/* Options initialization */
void amharic_default_options(TransliterationOptions *opts);

/* Pure transliteration function */
/* Caller provides output buffer; returns bytes written */
size_t amharic_transliterate(const char *input, char *output, size_t out_max, const TransliterationOptions *opts);

/* Live typing engine functions */
void amharic_engine_init(LiveTypingEngine *engine, const TransliterationOptions *opts);
EngineResult amharic_engine_input(LiveTypingEngine *engine, const char *text);
EngineResult amharic_engine_backspace(LiveTypingEngine *engine);
void amharic_engine_reset(LiveTypingEngine *engine);
void amharic_engine_commit_current(LiveTypingEngine *engine, char *out, size_t out_max);
const char* amharic_engine_get_buffer(const LiveTypingEngine *engine);
void amharic_engine_get_composing(const LiveTypingEngine *engine, char *out, size_t out_max);

/* Helper to convert code point to UTF-8 */
size_t amharic_utf8_encode(uint32_t codepoint, char *out);

#ifdef __cplusplus
}
#endif

#endif /* AMHARIC_CORE_H */
