#include <ibus.h>
#include <stdio.h>
#include "engine.h"

static void init_bus(IBusBus *bus, gboolean ibus_daemon) {
    IBusFactory *factory = ibus_factory_new(ibus_bus_get_connection(bus));
    ibus_factory_add_engine(factory, "amharic-phonetic", IBUS_TYPE_AMHARIC_ENGINE);

    if (ibus_daemon) {
        ibus_bus_request_name(bus, "org.freedesktop.IBus.Amharic", 0);
    } else {
        IBusComponent *component = ibus_component_new(
            "org.freedesktop.IBus.Amharic",
            "Amharic Phonetic Input Method",
            "1.0.0",
            "MIT",
            "Antigravity",
            "https://github.com/DBU/amharic-keyboard",
            "",
            "ibus-amharic"
        );
        ibus_component_add_engine(
            component,
            ibus_engine_desc_new(
                "amharic-phonetic",
                "Amharic (Addiyon Phonetic)",
                "Amharic phonetic input method using Addiyon scheme",
                "am",
                "MIT",
                "Antigravity",
                "ibus-amharic",
                "default"
            )
        );
        ibus_bus_register_component(bus, component);
    }
}

int main(int argc, char **argv) {
    gboolean ibus_daemon = FALSE;
    GError *error = NULL;
    GOptionEntry entries[] = {
        { "ibus", 'i', 0, G_OPTION_ARG_NONE, &ibus_daemon, "Executed by ibus-daemon", NULL },
        { NULL }
    };

    ibus_init();

    GOptionContext *context = g_option_context_new("- ibus amharic engine");
    g_option_context_add_main_entries(context, entries, "ibus-amharic");
    if (!g_option_context_parse(context, &argc, &argv, &error)) {
        g_print("Option parsing failed: %s\n", error->message);
        return 1;
    }

    IBusBus *bus = ibus_bus_new();
    if (!ibus_bus_is_connected(bus)) {
        g_warning("Could not connect to IBus bus.");
        return 1;
    }

    init_bus(bus, ibus_daemon);
    ibus_main();

    return 0;
}
