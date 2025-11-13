// swift-tools-version: 6.2
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Package",
    platforms: [.iOS(.v26)],
    products: [
        .library(
            name: "Package",
            targets: ["Package"]
        ),
    ],
    targets: [
        .target(
            name: "Package"
        ),
        .testTarget(
            name: "PackageTests",
            dependencies: ["Package"]
        ),
    ]
)
