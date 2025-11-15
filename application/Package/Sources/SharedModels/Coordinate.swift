//
//  Coordinate.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import CoreLocation
import Foundation

/// `CLLocationCoordinate2D` と同じく地図上における緯度経度を表すモデル.
///
/// - note: `CLLocationCoordinate2D` が `Hashable` や `Codable` に準拠していないため新規で定義.
public struct Coordinate: Sendable, Hashable, Codable {
    /// 緯度.
    public let latitude: Double
    /// 経度.
    public let longitude: Double

    public init(
        latitude: Double,
        longitude: Double
    ) {
        self.latitude = latitude
        self.longitude = longitude
    }
}

public extension Coordinate {
    var locationCoordinate2D: CLLocationCoordinate2D {
        CLLocationCoordinate2D(
            latitude: latitude,
            longitude: longitude
        )
    }
}
