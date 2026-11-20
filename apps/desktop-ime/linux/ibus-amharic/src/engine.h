#ifndef IBUS_AMHARIC_ENGINE_H
#define IBUS_AMHARIC_ENGINE_H

#include <ibus.h>
#include "../core/amharic_core.h"

G_BEGIN_DECLS

#define IBUS_TYPE_AMHARIC_ENGINE (ibus_amharic_engine_get_type())
G_DECLARE_FINAL_TYPE(IBusAmharicEngine, ibus_amharic_engine, IBUS, AMHARIC_ENGINE, IBusEngine)

struct _IBusAmharicEngine {
    IBusEngine parent;
    LiveTypingEngine core_engine;
    gboolean is_amharic_enabled;
};

void ibus_amharic_engine_register_component(IBusBus *bus);

G_END_DECLS

#endif /* IBUS_AMHARIC_ENGINE_H */
