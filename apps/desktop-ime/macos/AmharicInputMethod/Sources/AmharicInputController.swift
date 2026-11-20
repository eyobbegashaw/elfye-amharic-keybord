import Cocoa
import InputMethodKit
import AmharicCore

@objc(AmharicInputController)
public class AmharicInputController: IMKInputController {
    private var engine = LiveTypingEngine()
    private var isAmharicEnabled: Bool = true

    public override init!(server: IMKServer!, delegate: Any!, client inputClient: Any!) {
        super.init(server: server, delegate: delegate, client: inputClient)
    }

    public override func handle(_ event: NSEvent!, client sender: Any!) -> Bool {
        guard let event = event, event.type == .keyDown else {
            return false
        }

        guard let client = sender as? (NSObjectProtocol & IMKTextInput) else {
            return false
        }

        // 1. Toggle shortcut: Ctrl + Space
        let flags = event.modifierFlags.intersection(.deviceIndependentFlagsMask)
        if flags.contains(.control) && event.keyCode == 49 /* Space */ {
            commitComposition(sender)
            isAmharicEnabled.toggle()
            return true
        }

        // If English mode is active, pass all keystrokes directly to client
        if !isAmharicEnabled {
            return false
        }

        // 2. Command or Control shortcuts (e.g. Cmd+C, Cmd+V, Cmd+Z) pass through
        if flags.contains(.command) || (flags.contains(.control) && event.keyCode != 49) {
            commitComposition(sender)
            return false
        }

        // 3. Backspace handling (keyCode 51)
        if event.keyCode == 51 {
            if !engine.getBuffer().isEmpty {
                let res = engine.backspace()
                if !res.composing.isEmpty {
                    client.setMarkedText(
                        res.composing,
                        selectionRange: NSRange(location: res.composing.utf16.count, length: 0),
                        replacementRange: NSRange(location: NSNotFound, length: NSNotFound)
                    )
                } else {
                    client.setMarkedText(
                        "",
                        selectionRange: NSRange(location: 0, length: 0),
                        replacementRange: NSRange(location: NSNotFound, length: NSNotFound)
                    )
                }
                return true
            }
            return false
        }

        // 4. Boundary keys: Return, Tab, Escape, Arrow keys commit current composing text
        if event.keyCode == 36 /* Return */ ||
           event.keyCode == 76 /* KP Enter */ ||
           event.keyCode == 48 /* Tab */ ||
           event.keyCode == 53 /* Escape */ ||
           event.keyCode == 123 /* Left */ ||
           event.keyCode == 124 /* Right */ ||
           event.keyCode == 125 /* Down */ ||
           event.keyCode == 126 /* Up */ {

            if !engine.getBuffer().isEmpty {
                commitComposition(sender)
            }
            return false
        }

        // 5. Printable characters
        guard let chars = event.characters, !chars.isEmpty else {
            return false
        }

        let res = engine.input(chars)

        if !res.committed.isEmpty {
            client.insertText(
                res.committed,
                replacementRange: NSRange(location: NSNotFound, length: NSNotFound)
            )
        }

        if !res.composing.isEmpty {
            client.setMarkedText(
                res.composing,
                selectionRange: NSRange(location: res.composing.utf16.count, length: 0),
                replacementRange: NSRange(location: NSNotFound, length: NSNotFound)
            )
        } else {
            client.setMarkedText(
                "",
                selectionRange: NSRange(location: 0, length: 0),
                replacementRange: NSRange(location: NSNotFound, length: NSNotFound)
            )
        }

        return true
    }

    public override func commitComposition(_ sender: Any!) {
        guard let client = sender as? (NSObjectProtocol & IMKTextInput) else {
            engine.reset()
            return
        }

        let committed = engine.commitCurrent()
        if !committed.isEmpty {
            client.insertText(
                committed,
                replacementRange: NSRange(location: NSNotFound, length: NSNotFound)
            )
        }
        client.setMarkedText(
            "",
            selectionRange: NSRange(location: 0, length: 0),
            replacementRange: NSRange(location: NSNotFound, length: NSNotFound)
        )
    }

    public override func menu() -> NSMenu! {
        let menu = NSMenu(title: "Amharic Phonetic")

        let statusTitle = isAmharicEnabled ? "አማርኛ (በርቷል)" : "English (Active)"
        let statusItem = NSMenuItem(title: statusTitle, action: nil, keyEquivalent: "")
        statusItem.isEnabled = false
        menu.addItem(statusItem)

        menu.addItem(NSMenuItem.separator())

        let toggleItem = NSMenuItem(
            title: isAmharicEnabled ? "ወደ እንግሊዝኛ ቀይር (Ctrl+Space)" : "ወደ አማርኛ ቀይር (Ctrl+Space)",
            action: #selector(toggleMode),
            keyEquivalent: " "
        )
        toggleItem.keyEquivalentModifierMask = .control
        toggleItem.target = self
        menu.addItem(toggleItem)

        menu.addItem(NSMenuItem.separator())

        let aboutItem = NSMenuItem(title: "ስለ አዲዮን ኪቦርድ (Addiyon Scheme)", action: nil, keyEquivalent: "")
        aboutItem.isEnabled = false
        menu.addItem(aboutItem)

        return menu
    }

    @objc private func toggleMode() {
        isAmharicEnabled.toggle()
    }
}
