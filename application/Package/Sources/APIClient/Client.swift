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
public struct APIClient: Sendable {
    /// ページ情報を取得する.
    public var fetchPageInformation: @Sendable () async throws -> PageInformation
    /// 指定されたページの部屋情報を取得する.
    public var fetchRentalProperties: @Sendable (_ page: Int) async throws -> [RentalProperty]
}

extension APIClient: TestDependencyKey {
    public static var previewValue: APIClient {
        .init {
            .init(
                totalPages: 1,
                totalProperties: 1,
                updatedAt: Int(Date().timeIntervalSince1970)
            )
        } fetchRentalProperties: { page in
            []
        }
    }

    public static var testValue: APIClient {
        .init()
    }
}

extension DependencyValues {
    public var apiClient: APIClient {
        get { self[APIClient.self] }
        set { self[APIClient.self] = newValue }
    }
}
