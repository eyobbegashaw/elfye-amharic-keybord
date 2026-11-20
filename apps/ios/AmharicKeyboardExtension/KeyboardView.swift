import UIKit

public final class KeyboardView: UIView {
    public weak var delegate: KeyboardKeyDelegate?

    private let mainStackView = UIStackView()
    private var allKeyViews: [KeyboardKey] = []

    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func setupView() {
        translatesAutoresizingMaskIntoConstraints = false
        mainStackView.translatesAutoresizingMaskIntoConstraints = false
        mainStackView.axis = .vertical
        mainStackView.distribution = .fillEqually
        mainStackView.spacing = 8.0
        mainStackView.alignment = .fill

        addSubview(mainStackView)

        let isIPad = UIDevice.current.userInterfaceIdiom == .pad
        let horizontalPadding: CGFloat = isIPad ? 16.0 : 4.0
        let verticalPadding: CGFloat = isIPad ? 12.0 : 6.0

        NSLayoutConstraint.activate([
            mainStackView.topAnchor.constraint(equalTo: topAnchor, constant: verticalPadding),
            mainStackView.bottomAnchor.constraint(equalTo: safeAreaLayoutGuide.bottomAnchor, constant: -verticalPadding),
            mainStackView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: horizontalPadding),
            mainStackView.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -horizontalPadding),
        ])
    }

    public func rebuildLayout(
        layer: KeyboardLayer,
        shiftState: ShiftState,
        isAmharic: Bool,
        needsGlobeKey: Bool,
        returnKeyType: UIReturnKeyType
    ) {
        // Clear previous keys
        for rowView in mainStackView.arrangedSubviews {
            mainStackView.removeArrangedSubview(rowView)
            rowView.removeFromSuperview()
        }
        allKeyViews.removeAll()

        let rows = KeyboardLayout.rows(
            for: layer,
            shiftState: shiftState,
            isAmharic: isAmharic,
            needsGlobeKey: needsGlobeKey
        )

        let isDark = traitCollection.userInterfaceStyle == .dark

        for row in rows {
            let rowStack = UIStackView()
            rowStack.axis = .horizontal
            rowStack.spacing = 6.0
            rowStack.distribution = .fill
            rowStack.alignment = .fill

            var standardKey: KeyboardKey? = nil

            for keyDef in row {
                let keyView = KeyboardKey(definition: keyDef)
                keyView.delegate = delegate
                keyView.updateAppearance(isDarkMode: isDark)
                allKeyViews.append(keyView)

                // Customize return key label
                if keyDef.type == .return {
                    let returnLabel = returnTitle(for: returnKeyType, isAmharic: isAmharic)
                    keyView.setTitle(returnLabel, for: .normal)
                }

                rowStack.addArrangedSubview(keyView)

                if keyDef.widthMultiplier == 1.0 {
                    if standardKey == nil {
                        standardKey = keyView
                    } else {
                        keyView.widthAnchor.constraint(equalTo: standardKey!.widthAnchor).isActive = true
                    }
                }
            }

            // Constrain non-1.0 multiplier keys relative to standard key in this row
            if let standard = standardKey {
                for keyView in rowStack.arrangedSubviews.compactMap({ $0 as? KeyboardKey }) {
                    let multiplier = keyView.definition.widthMultiplier
                    if multiplier != 1.0 {
                        keyView.widthAnchor.constraint(
                            equalTo: standard.widthAnchor,
                            multiplier: multiplier
                        ).isActive = true
                    }
                }
            }

            mainStackView.addArrangedSubview(rowStack)
        }
    }

    public func updateTheme() {
        let isDark = traitCollection.userInterfaceStyle == .dark
        for key in allKeyViews {
            key.updateAppearance(isDarkMode: isDark)
        }
    }

    private func returnTitle(for type: UIReturnKeyType, isAmharic: Bool) -> String {
        switch type {
        case .go:
            return isAmharic ? "ሂድ" : "Go"
        case .google, .yahoo:
            return isAmharic ? "ፈልግ" : "Search"
        case .join:
            return isAmharic ? "ተቀላቀል" : "Join"
        case .next:
            return isAmharic ? "ቀጣይ" : "Next"
        case .route:
            return isAmharic ? "ሂድ" : "Route"
        case .search:
            return isAmharic ? "ፈልግ" : "Search"
        case .send:
            return isAmharic ? "ላክ" : "Send"
        case .done:
            return isAmharic ? "አስገባ" : "Done"
        case .continue:
            return isAmharic ? "ቀጥል" : "Continue"
        default:
            return isAmharic ? "አዲስ መስመር" : "return"
        }
    }
}
