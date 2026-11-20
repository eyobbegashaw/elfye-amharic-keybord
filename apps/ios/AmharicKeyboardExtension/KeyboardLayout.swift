import Foundation

public enum KeyboardLayer {
    case letters
    case numbers
    case symbols
}

public enum ShiftState {
    case normal
    case shifted
    case capsLock
}

public enum KeyType: Equatable {
    case character(String)
    case shift
    case backspace
    case modeSwitch(KeyboardLayer)
    case languageToggle
    case globe
    case space
    case `return`
}

public struct KeyDefinition {
    public let type: KeyType
    public let label: String
    public let systemImageName: String?
    public let widthMultiplier: CGFloat

    public init(
        type: KeyType,
        label: String = "",
        systemImageName: String? = nil,
        widthMultiplier: CGFloat = 1.0
    ) {
        self.type = type
        self.label = label
        self.systemImageName = systemImageName
        self.widthMultiplier = widthMultiplier
    }
}

public struct KeyboardLayout {
    public static func rows(
        for layer: KeyboardLayer,
        shiftState: ShiftState,
        isAmharic: Bool,
        needsGlobeKey: Bool
    ) -> [[KeyDefinition]] {
        switch layer {
        case .letters:
            return letterRows(shiftState: shiftState, isAmharic: isAmharic, needsGlobeKey: needsGlobeKey)
        case .numbers:
            return numberRows(isAmharic: isAmharic, needsGlobeKey: needsGlobeKey)
        case .symbols:
            return symbolRows(isAmharic: isAmharic, needsGlobeKey: needsGlobeKey)
        }
    }

    private static func letterRows(
        shiftState: ShiftState,
        isAmharic: Bool,
        needsGlobeKey: Bool
    ) -> [[KeyDefinition]] {
        let isUpper = (shiftState == .shifted || shiftState == .capsLock)

        let r1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map { char in
            let letter = isUpper ? char.uppercased() : char
            return KeyDefinition(type: .character(letter), label: letter)
        }

        let r2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"].map { char in
            let letter = isUpper ? char.uppercased() : char
            return KeyDefinition(type: .character(letter), label: letter)
        }

        var r3: [KeyDefinition] = []
        let shiftIcon: String
        switch shiftState {
        case .normal:
            shiftIcon = "shift"
        case .shifted:
            shiftIcon = "shift.fill"
        case .capsLock:
            shiftIcon = "capslock.fill"
        }
        r3.append(KeyDefinition(type: .shift, label: "", systemImageName: shiftIcon, widthMultiplier: 1.4))

        for char in ["z", "x", "c", "v", "b", "n", "m"] {
            let letter = isUpper ? char.uppercased() : char
            r3.append(KeyDefinition(type: .character(letter), label: letter))
        }

        r3.append(KeyDefinition(type: .backspace, label: "", systemImageName: "delete.left", widthMultiplier: 1.4))

        var r4: [KeyDefinition] = []
        r4.append(KeyDefinition(type: .modeSwitch(.numbers), label: "123", widthMultiplier: 1.3))

        if needsGlobeKey {
            r4.append(KeyDefinition(type: .globe, systemImageName: "globe", widthMultiplier: 1.0))
        }

        let langLabel = isAmharic ? "አማ" : "EN"
        r4.append(KeyDefinition(type: .languageToggle, label: langLabel, widthMultiplier: 1.1))

        let spaceLabel = isAmharic ? "ክፍተት" : "space"
        r4.append(KeyDefinition(type: .space, label: spaceLabel, widthMultiplier: 4.0))

        r4.append(KeyDefinition(type: .return, label: "return", widthMultiplier: 1.5))

        return [r1, r2, r3, r4]
    }

    private static func numberRows(
        isAmharic: Bool,
        needsGlobeKey: Bool
    ) -> [[KeyDefinition]] {
        let r1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map {
            KeyDefinition(type: .character($0), label: $0)
        }

        let r2 = ["-", "/", ":", ";", "(", ")", "$", "&", "@", "\""].map {
            KeyDefinition(type: .character($0), label: $0)
        }

        var r3: [KeyDefinition] = []
        r3.append(KeyDefinition(type: .modeSwitch(.symbols), label: "#+=", widthMultiplier: 1.4))

        // In numbers row, include Ethiopic punctuation directly
        let punctuationKeys = ["፣", "።", "፤", "፡", ".", ",", "?", "!"]
        for p in punctuationKeys {
            r3.append(KeyDefinition(type: .character(p), label: p))
        }

        r3.append(KeyDefinition(type: .backspace, label: "", systemImageName: "delete.left", widthMultiplier: 1.4))

        var r4: [KeyDefinition] = []
        r4.append(KeyDefinition(type: .modeSwitch(.letters), label: "ABC", widthMultiplier: 1.3))

        if needsGlobeKey {
            r4.append(KeyDefinition(type: .globe, systemImageName: "globe", widthMultiplier: 1.0))
        }

        let langLabel = isAmharic ? "አማ" : "EN"
        r4.append(KeyDefinition(type: .languageToggle, label: langLabel, widthMultiplier: 1.1))

        let spaceLabel = isAmharic ? "ክፍተት" : "space"
        r4.append(KeyDefinition(type: .space, label: spaceLabel, widthMultiplier: 4.0))

        r4.append(KeyDefinition(type: .return, label: "return", widthMultiplier: 1.5))

        return [r1, r2, r3, r4]
    }

    private static func symbolRows(
        isAmharic: Bool,
        needsGlobeKey: Bool
    ) -> [[KeyDefinition]] {
        let r1 = ["[", "]", "{", "}", "#", "%", "^", "*", "+", "="].map {
            KeyDefinition(type: .character($0), label: $0)
        }

        let r2 = ["_", "\\", "|", "~", "<", ">", "€", "£", "¥", "•"].map {
            KeyDefinition(type: .character($0), label: $0)
        }

        var r3: [KeyDefinition] = []
        r3.append(KeyDefinition(type: .modeSwitch(.numbers), label: "123", widthMultiplier: 1.4))

        let symbolKeys = ["'", "\"", "፣", "።", "፤", "፡", "…", "?"]
        for s in symbolKeys {
            r3.append(KeyDefinition(type: .character(s), label: s))
        }

        r3.append(KeyDefinition(type: .backspace, label: "", systemImageName: "delete.left", widthMultiplier: 1.4))

        var r4: [KeyDefinition] = []
        r4.append(KeyDefinition(type: .modeSwitch(.letters), label: "ABC", widthMultiplier: 1.3))

        if needsGlobeKey {
            r4.append(KeyDefinition(type: .globe, systemImageName: "globe", widthMultiplier: 1.0))
        }

        let langLabel = isAmharic ? "አማ" : "EN"
        r4.append(KeyDefinition(type: .languageToggle, label: langLabel, widthMultiplier: 1.1))

        let spaceLabel = isAmharic ? "ክፍተት" : "space"
        r4.append(KeyDefinition(type: .space, label: spaceLabel, widthMultiplier: 4.0))

        r4.append(KeyDefinition(type: .return, label: "return", widthMultiplier: 1.5))

        return [r1, r2, r3, r4]
    }
}
