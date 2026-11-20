// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AmharicCore",
    platforms: [
        .iOS(.v15),
        .macOS(.v12)
    ],
    products: [
        .library(
            name: "AmharicCore",
            targets: ["AmharicCore"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "AmharicCore",
            dependencies: [],
            path: "Sources/AmharicCore"
        ),
        .testTarget(
            name: "AmharicCoreTests",
            dependencies: ["AmharicCore"],
            path: "Tests/AmharicCoreTests",
            resources: [
                .copy("Resources/test-vectors.json")
            ]
        ),
    ]
)
