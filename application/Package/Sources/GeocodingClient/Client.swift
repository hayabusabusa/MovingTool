//
//  Client.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import Dependencies
import DependenciesMacros
import Foundation
import SharedModels

@DependencyClient
public struct GeocodingClient: Sendable {
    /// ジオコーディングを行なって住所の文字列から座標を検索して付与する.
    public var appendCoordinate: @Sendable (_ rooms: [Room]) async throws -> [AddressGeocodedRoom]
}

extension GeocodingClient: TestDependencyKey {
    public static var previewValue: GeocodingClient {
        .init { _ in
            []
        }
    }

    public static var testValue: GeocodingClient {
        .init()
    }
}

extension DependencyValues {
    public var geocodingClient: GeocodingClient {
        get { self[GeocodingClient.self] }
        set { self[GeocodingClient.self] = newValue }
    }
}
