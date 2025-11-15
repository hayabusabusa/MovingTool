// swift-tools-version: 6.2
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Package",
    platforms: [.iOS(.v26)],
    products: [
        .library(
            name: "APIClient",
            targets: ["APIClient"]
        ),
        .library(
            name: "GeocodingClient",
            targets: ["GeocodingClient"]
        ),
        .library(
            name: "SharedModels",
            targets: ["SharedModels"]
        ),
    ],
    dependencies: [
        .package(
            url: "https://github.com/pointfreeco/swift-dependencies.git",
            exact: "1.10.0"
        ),
        .package(
            url: "https://github.com/kean/Nuke.git",
            exact: "12.8.0"
        )
    ],
    targets: [
        .target(
            name: "APIClient",
            dependencies: [
                "SharedModels",
                .product(name: "Dependencies", package: "swift-dependencies"),
                .product(name: "DependenciesMacros", package: "swift-dependencies"),
            ],
        ),
        .target(
            name: "GeocodingClient",
            dependencies: [
                "SharedModels",
                .product(name: "Dependencies", package: "swift-dependencies"),
                .product(name: "DependenciesMacros", package: "swift-dependencies"),
            ],
        ),
        .target(
            name: "SharedModels"
        ),
        .testTarget(
            name: "PackageTests",
            dependencies: ["SharedModels"]
        ),
    ]
)
