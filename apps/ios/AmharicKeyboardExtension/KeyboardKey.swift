import UIKit

public protocol KeyboardKeyDelegate: AnyObject {
    func didTapKey(_ key: KeyDefinition)
    func didDoubleTapShift()
    func didLongPressBackspace()
}

public final class KeyboardKey: UIButton {
    public let definition: KeyDefinition
    public weak var delegate: KeyboardKeyDelegate?

    private var backspaceRepeatTimer: Timer?
    private let feedbackGenerator = UIImpactFeedbackGenerator(style: .light)

    public init(definition: KeyDefinition) {
        self.definition = definition
        super.init(frame: .zero)
        setupUI()
        setupInteractions()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    deinit {
        stopBackspaceRepeat()
    }

    private func setupUI() {
        translatesAutoresizingMaskIntoConstraints = false
        layer.cornerRadius = 5.0
        layer.masksToBounds = false
        layer.shadowOffset = CGSize(width: 0, height: 1)
        layer.shadowRadius = 0
        layer.shadowOpacity = 0.35

        titleLabel?.font = UIFont.systemFont(ofSize: 22, weight: .regular)
        titleLabel?.adjustsFontSizeToFitWidth = true
        titleLabel?.minimumScaleFactor = 0.6

        if let imageName = definition.systemImageName {
            let config = UIImage.SymbolConfiguration(pointSize: 18, weight: .regular)
            let image = UIImage(systemName: imageName, withConfiguration: config)
            setImage(image, for: .normal)
        } else {
            setTitle(definition.label, for: .normal)
        }

        updateAppearance(isDarkMode: traitCollection.userInterfaceStyle == .dark)
    }

    private func setupInteractions() {
        addTarget(self, action: #selector(handleTouchDown), for: .touchDown)
        addTarget(self, action: #selector(handleTouchUpInside), for: .touchUpInside)
        addTarget(self, action: #selector(handleTouchUpOutside), for: [.touchUpOutside, .touchCancel])

        if definition.type == .shift {
            let doubleTap = UITapGestureRecognizer(target: self, action: #selector(handleDoubleTapShift))
            doubleTap.numberOfTapsRequired = 2
            addGestureRecognizer(doubleTap)
        }

        if definition.type == .backspace {
            let longPress = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPressBackspace(_:)))
            longPress.minimumPressDuration = 0.35
            addGestureRecognizer(longPress)
        }
    }

    public func updateAppearance(isDarkMode: Bool) {
        let isSpecialKey: Bool
        switch definition.type {
        case .character, .space:
            isSpecialKey = false
        default:
            isSpecialKey = true
        }

        if isDarkMode {
            backgroundColor = isSpecialKey
                ? UIColor(red: 45/255, green: 45/255, blue: 48/255, alpha: 1.0)
                : UIColor(red: 85/255, green: 85/255, blue: 88/255, alpha: 1.0)

            setTitleColor(.white, for: .normal)
            tintColor = .white
            layer.shadowColor = UIColor.black.cgColor
        } else {
            backgroundColor = isSpecialKey
                ? UIColor(red: 172/255, green: 179/255, blue: 188/255, alpha: 1.0)
                : UIColor.white

            setTitleColor(.black, for: .normal)
            tintColor = .black
            layer.shadowColor = UIColor(red: 136/255, green: 138/255, blue: 142/255, alpha: 1.0).cgColor
        }

        if definition.type == .return {
            backgroundColor = UIColor.systemBlue
            setTitleColor(.white, for: .normal)
            tintColor = .white
        }
    }

    @objc private func handleTouchDown() {
        feedbackGenerator.prepare()
        feedbackGenerator.impactOccurred()
        alpha = 0.75
    }

    @objc private func handleTouchUpInside() {
        alpha = 1.0
        stopBackspaceRepeat()
        delegate?.didTapKey(definition)
    }

    @objc private func handleTouchUpOutside() {
        alpha = 1.0
        stopBackspaceRepeat()
    }

    @objc private func handleDoubleTapShift() {
        delegate?.didDoubleTapShift()
    }

    @objc private func handleLongPressBackspace(_ gesture: UILongPressGestureRecognizer) {
        switch gesture.state {
        case .began:
            startBackspaceRepeat()
        case .ended, .cancelled, .failed:
            stopBackspaceRepeat()
        default:
            break
        }
    }

    private func startBackspaceRepeat() {
        stopBackspaceRepeat()
        backspaceRepeatTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.feedbackGenerator.impactOccurred()
            self?.delegate?.didLongPressBackspace()
        }
    }

    private func stopBackspaceRepeat() {
        backspaceRepeatTimer?.invalidate()
        backspaceRepeatTimer = nil
    }
}
