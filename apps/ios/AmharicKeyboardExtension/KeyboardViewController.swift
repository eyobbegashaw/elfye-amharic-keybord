import UIKit
import AmharicCore

public final class KeyboardViewController: UIInputViewController, KeyboardKeyDelegate {
    private var keyboardView: KeyboardView!
    private var engine = LiveTypingEngine()

    private var currentLayer: KeyboardLayer = .letters
    private var shiftState: ShiftState = .normal
    private var isAmharic: Bool = true
    private var currentComposingText: String = ""

    public override func viewDidLoad() {
        super.viewDidLoad()
        setupKeyboardView()
    }

    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        checkKeyboardType()
        reloadLayout()
    }

    public override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        // Ensure proper keyboard height constraints
        let isIPad = UIDevice.current.userInterfaceIdiom == .pad
        let isLandscape = view.bounds.width > view.bounds.height
        let targetHeight: CGFloat = isIPad ? 320.0 : (isLandscape ? 175.0 : 220.0)

        if view.frame.height != targetHeight {
            view.heightAnchor.constraint(equalToConstant: targetHeight).priority = .defaultHigh
        }
    }

    public override func textWillChange(_ textInput: UITextInput?) {
        super.textWillChange(textInput)
    }

    public override func textDidChange(_ textInput: UITextInput?) {
        super.textDidChange(textInput)

        // Verify if active composing syllable is still present before caret
        if !currentComposingText.isEmpty {
            let before = textDocumentProxy.documentContextBeforeInput ?? ""
            if !before.hasSuffix(currentComposingText) {
                // Caret was moved or text was altered externally: commit / reset
                engine.reset()
                currentComposingText = ""
            }
        }

        checkKeyboardType()
        keyboardView.updateTheme()
        reloadLayout()
    }

    public override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
        keyboardView?.updateTheme()
    }

    private func setupKeyboardView() {
        keyboardView = KeyboardView()
        keyboardView.delegate = self
        view.addSubview(keyboardView)

        NSLayoutConstraint.activate([
            keyboardView.topAnchor.constraint(equalTo: view.topAnchor),
            keyboardView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            keyboardView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            keyboardView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        ])
    }

    private func checkKeyboardType() {
        if let kType = textDocumentProxy.keyboardType {
            switch kType {
            case .emailAddress, .URL, .numberPad, .phonePad, .decimalPad, .asciiCapable, .asciiCapableNumberPad:
                isAmharic = false
            default:
                break
            }
        }
    }

    private func reloadLayout() {
        let returnType = textDocumentProxy.returnKeyType ?? .default
        let needsGlobe = self.needsInputModeSwitchKey

        keyboardView.rebuildLayout(
            layer: currentLayer,
            shiftState: shiftState,
            isAmharic: isAmharic,
            needsGlobeKey: needsGlobe,
            returnKeyType: returnType
        )
    }

    // MARK: - KeyboardKeyDelegate

    public func didTapKey(_ key: KeyDefinition) {
        switch key.type {
        case .character(let char):
            handleCharacterInput(char)

        case .space:
            handleSpace()

        case .backspace:
            handleBackspace()

        case .return:
            handleReturn()

        case .shift:
            handleShift()

        case .modeSwitch(let targetLayer):
            currentLayer = targetLayer
            reloadLayout()

        case .languageToggle:
            isAmharic.toggle()
            engine.reset()
            currentComposingText = ""
            reloadLayout()

        case .globe:
            advanceToNextInputMode()
        }
    }

    public func didDoubleTapShift() {
        shiftState = .capsLock
        reloadLayout()
    }

    public func didLongPressBackspace() {
        handleBackspace()
    }

    // MARK: - Input & Composition Logic

    private func handleCharacterInput(_ char: String) {
        if !isAmharic {
            // In English mode: direct native insertion
            textDocumentProxy.insertText(char)
            if shiftState == .shifted {
                shiftState = .normal
                reloadLayout()
            }
            return
        }

        // In Amharic mode: process through LiveTypingEngine
        let res = engine.input(char)

        if !res.committed.isEmpty && !res.composing.isEmpty {
            // Syllable transitioned: committed previous syllable, composing new one
            if !currentComposingText.isEmpty && res.committed == currentComposingText {
                // Previous composing syllable is already sitting in document; insert new composing
                textDocumentProxy.insertText(res.composing)
            } else {
                replaceCurrentComposing(with: res.committed + res.composing)
            }
            currentComposingText = res.composing
        } else if !res.composing.isEmpty {
            // Syllable updated (e.g. 's' -> 'e' -> ሰ)
            replaceCurrentComposing(with: res.composing)
            currentComposingText = res.composing
        } else if !res.committed.isEmpty {
            // Syllable or symbol finalized
            if !currentComposingText.isEmpty && res.committed.hasPrefix(currentComposingText) {
                let remainder = String(res.committed.dropFirst(currentComposingText.count))
                textDocumentProxy.insertText(remainder)
            } else {
                replaceCurrentComposing(with: res.committed)
            }
            currentComposingText = ""
        } else {
            // Escape char consumed
            currentComposingText = ""
        }

        // Return shift to normal if single shifted
        if shiftState == .shifted {
            shiftState = .normal
            reloadLayout()
        }
    }

    private func replaceCurrentComposing(with newText: String) {
        if !currentComposingText.isEmpty {
            let before = textDocumentProxy.documentContextBeforeInput ?? ""
            if before.hasSuffix(currentComposingText) {
                for _ in 0..<currentComposingText.count {
                    textDocumentProxy.deleteBackward()
                }
            }
        }
        textDocumentProxy.insertText(newText)
    }

    private func handleSpace() {
        if isAmharic && !currentComposingText.isEmpty {
            let res = engine.input(" ")
            if !res.committed.isEmpty && res.committed.hasPrefix(currentComposingText) {
                let remainder = String(res.committed.dropFirst(currentComposingText.count))
                textDocumentProxy.insertText(remainder)
            } else {
                replaceCurrentComposing(with: res.committed.isEmpty ? " " : res.committed)
            }
            currentComposingText = ""
        } else {
            engine.reset()
            currentComposingText = ""
            textDocumentProxy.insertText(" ")
        }
    }

    private func handleBackspace() {
        if isAmharic && !currentComposingText.isEmpty {
            let res = engine.backspace()
            if !res.composing.isEmpty {
                replaceCurrentComposing(with: res.composing)
                currentComposingText = res.composing
            } else {
                replaceCurrentComposing(with: "")
                currentComposingText = ""
            }
        } else {
            engine.reset()
            currentComposingText = ""
            textDocumentProxy.deleteBackward()
        }
    }

    private func handleReturn() {
        if isAmharic && !currentComposingText.isEmpty {
            _ = engine.commitCurrent()
            currentComposingText = ""
        }
        textDocumentProxy.insertText("\n")
    }

    private func handleShift() {
        switch shiftState {
        case .normal:
            shiftState = .shifted
        case .shifted:
            shiftState = .normal
        case .capsLock:
            shiftState = .normal
        }
        reloadLayout()
    }
}
