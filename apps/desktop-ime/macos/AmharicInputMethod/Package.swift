// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AmharicInputMethod",
    platforms: [
        .macOS(.v12)
    ],
    products: [
        .executable(
            name: "AmharicInputMethod",
            targets: ["AmharicInputMethod"]
        )
    ],
    dependencies: [
        // Reuse the Swift AmharicCore package from apps/ios (do not fork it)
        .package(path: "../../../ios/AmharicCore")
    ],
    targets: [
        .executableTarget(
            name: "AmharicInputMethod",
            dependencies: [
                .product(name: "AmharicCore", package: "AmharicCore")
            ],
            path: "Sources",
            resources: [
                .process("Resources")
            ]
        )
    ]
)
