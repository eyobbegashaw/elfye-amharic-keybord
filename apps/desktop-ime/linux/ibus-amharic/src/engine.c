#include "engine.h"
#include <ibus.h>

G_DEFINE_TYPE(IBusAmharicEngine, ibus_amharic_engine, IBUS_TYPE_ENGINE)

static void ibus_amharic_engine_commit_pending(IBusAmharicEngine *self) {
    char committed[32] = {0};
    amharic_engine_commit_current(&self->core_engine, committed, sizeof(committed));
    if (committed[0] != '\0') {
        IBusText *text = ibus_text_new_from_string(committed);
        ibus_engine_commit_text((IBusEngine *)self, text);
        ibus_engine_hide_preedit_text((IBusEngine *)self);
    }
}

static gboolean ibus_amharic_engine_process_key_event(
    IBusEngine *engine,
    guint keyval,
    guint keycode,
    guint state
) {
    (void)keycode;
    IBusAmharicEngine *self = IBUS_AMHARIC_ENGINE(engine);

    /* Ignore key release events */
    if (state & IBUS_RELEASE_MASK) {
        return FALSE;
    }

    /* Hotkey: Ctrl + Space toggles English / Amharic */
    if ((state & IBUS_CONTROL_MASK) && keyval == IBUS_KEY_space) {
        ibus_amharic_engine_commit_pending(self);
        self->is_amharic_enabled = !self->is_amharic_enabled;
        return TRUE;
    }

    /* If Amharic transliteration is disabled, pass through natively */
    if (!self->is_amharic_enabled) {
        return FALSE;
    }

    /* Backspace handling */
    if (keyval == IBUS_KEY_BackSpace) {
        if (strlen(amharic_engine_get_buffer(&self->core_engine)) > 0) {
            EngineResult res = amharic_engine_backspace(&self->core_engine);
            if (res.composing[0] != '\0') {
                IBusText *text = ibus_text_new_from_string(res.composing);
                ibus_engine_update_preedit_text(engine, text, g_utf8_strlen(res.composing, -1), TRUE);
            } else {
                ibus_engine_hide_preedit_text(engine);
            }
            return TRUE;
        }
        return FALSE;
    }

    /* Enter / Return / Tab / Escape commits pending composing buffer */
    if (keyval == IBUS_KEY_Return || keyval == IBUS_KEY_KP_Enter ||
        keyval == IBUS_KEY_Tab || keyval == IBUS_KEY_Escape ||
        keyval == IBUS_KEY_Left || keyval == IBUS_KEY_Right ||
        keyval == IBUS_KEY_Up || keyval == IBUS_KEY_Down ||
        keyval == IBUS_KEY_Home || keyval == IBUS_KEY_End) {

        ibus_amharic_engine_commit_pending(self);
        return FALSE;
    }

    /* Filter out control/alt/super modifier combinations */
    if (state & (IBUS_CONTROL_MASK | IBUS_MOD1_MASK | IBUS_SUPER_MASK)) {
        return FALSE;
    }

    /* Printable ASCII and Unicode keys */
    gunichar ch = ibus_keyval_to_unicode(keyval);
    if (ch != 0 && (g_unichar_isprint(ch) || ch == ' ')) {
        gchar utf8[8] = {0};
        gint len = g_unichar_to_utf8(ch, utf8);
        utf8[len] = '\0';

        EngineResult res = amharic_engine_input(&self->core_engine, utf8);

        if (res.committed[0] != '\0') {
            IBusText *text = ibus_text_new_from_string(res.committed);
            ibus_engine_commit_text(engine, text);
        }

        if (res.composing[0] != '\0') {
            IBusText *text = ibus_text_new_from_string(res.composing);
            ibus_engine_update_preedit_text(engine, text, g_utf8_strlen(res.composing, -1), TRUE);
        } else {
            ibus_engine_hide_preedit_text(engine);
        }

        return TRUE;
    }

    return FALSE;
}

static void ibus_amharic_engine_focus_in(IBusEngine *engine) {
    IBusAmharicEngine *self = IBUS_AMHARIC_ENGINE(engine);
    amharic_engine_reset(&self->core_engine);
    ibus_engine_hide_preedit_text(engine);
}

static void ibus_amharic_engine_focus_out(IBusEngine *engine) {
    IBusAmharicEngine *self = IBUS_AMHARIC_ENGINE(engine);
    ibus_amharic_engine_commit_pending(self);
}

static void ibus_amharic_engine_reset(IBusEngine *engine) {
    IBusAmharicEngine *self = IBUS_AMHARIC_ENGINE(engine);
    ibus_amharic_engine_commit_pending(self);
}

static void ibus_amharic_engine_init(IBusAmharicEngine *self) {
    amharic_engine_init(&self->core_engine, NULL);
    self->is_amharic_enabled = TRUE;
}

static void ibus_amharic_engine_class_init(IBusAmharicEngineClass *klass) {
    IBusEngineClass *engine_class = IBUS_ENGINE_CLASS(klass);
    engine_class->process_key_event = ibus_amharic_engine_process_key_event;
    engine_class->focus_in = ibus_amharic_engine_focus_in;
    engine_class->focus_out = ibus_amharic_engine_focus_out;
    engine_class->reset = ibus_amharic_engine_reset;
}
