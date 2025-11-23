//
//  PageInformation.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import Foundation

/// スクレイピング対象ページの情報
public struct PageInformation: Sendable, Hashable, Codable {
    /// 総ページ数
    public let totalPages: Int
    /// 総物件数
    public let totalProperties: Int
    /// データ取得日時（UNIXタイムスタンプ）
    public let updatedAt: Int
    
    public init(
        totalPages: Int,
        totalProperties: Int,
        updatedAt: Int
    ) {
        self.totalPages = totalPages
        self.totalProperties = totalProperties
        self.updatedAt = updatedAt
    }
}
