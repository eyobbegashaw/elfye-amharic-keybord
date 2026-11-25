CC ?= gcc
CFLAGS ?= -Wall -Wextra -O2 -std=c11
PREFIX ?= /usr
LIBEXECDIR ?= $(PREFIX)/libexec
DATADIR ?= $(PREFIX)/share

IBUS_CFLAGS ?= $(shell pkg-config --cflags ibus-1.0 gio-2.0 2>/dev/null || echo "-I/usr/include/ibus-1.0 -I/usr/include/glib-2.0 -I/usr/lib/x86_64-linux-gnu/glib-2.0/include")
IBUS_LIBS ?= $(shell pkg-config --libs ibus-1.0 gio-2.0 2>/dev/null || echo "-libus-1.0 -lgio-2.0 -lgobject-2.0 -lglib-2.0")

SRCS_CORE = core/amharic_core.c
SRCS_ENGINE = src/engine.c src/main.c

all: build/ibus-engine-amharic build/test_vectors build/amharic.xml

build/test_vectors: core/test_vectors.c $(SRCS_CORE)
	@mkdir -p build
	$(CC) $(CFLAGS) -Icore core/test_vectors.c $(SRCS_CORE) -o $@

build/ibus-engine-amharic: $(SRCS_ENGINE) $(SRCS_CORE)
	@mkdir -p build
	$(CC) $(CFLAGS) $(IBUS_CFLAGS) -Icore -Isrc $(SRCS_ENGINE) $(SRCS_CORE) $(IBUS_LIBS) -o $@

build/amharic.xml: data/amharic.xml.in
	@mkdir -p build
	sed "s|@LIBEXECDIR@|$(LIBEXECDIR)|g" $< > $@

test: build/test_vectors
	./build/test_vectors ../../../../test-vectors.json

install: all
	install -d $(DESTDIR)$(LIBEXECDIR)
	install -m 755 build/ibus-engine-amharic $(DESTDIR)$(LIBEXECDIR)/ibus-engine-amharic
	install -d $(DESTDIR)$(DATADIR)/ibus/component
	install -m 644 build/amharic.xml $(DESTDIR)$(DATADIR)/ibus/component/amharic.xml

install-user:
	@mkdir -p $(HOME)/.local/libexec
	@mkdir -p $(HOME)/.local/share/ibus/component
	sed "s|@LIBEXECDIR@|$(HOME)/.local/libexec|g" data/amharic.xml.in > $(HOME)/.local/share/ibus/component/amharic.xml
	install -m 755 build/ibus-engine-amharic $(HOME)/.local/libexec/ibus-engine-amharic
	@echo "Installed to ~/.local. Run 'ibus restart' to load the new engine."

uninstall:
	rm -f $(DESTDIR)$(LIBEXECDIR)/ibus-engine-amharic
	rm -f $(DESTDIR)$(DATADIR)/ibus/component/amharic.xml

uninstall-user:
	rm -f $(HOME)/.local/libexec/ibus-engine-amharic
	rm -f $(HOME)/.local/share/ibus/component/amharic.xml

clean:
	rm -rf build

.PHONY: all test install install-user uninstall uninstall-user clean
