//
//  RentalProperty.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/23.
//

import Foundation

/// 賃貸物件のモデル
public struct RentalProperty: Sendable, Identifiable, Hashable, Codable {
    /// ID
    public let id: String
    /// 物件名
    public let name: String
    /// 物件の住所
    public let address: String
    /// 築年数
    public let age: Int
    /// 物件のサムネイル画像URL
    public let thumbnailURL: String
    /// 物件に紐づく部屋の一覧
    public let rooms: [Room]
    
    private enum CodingKeys: String, CodingKey {
        case id
        case name
        case address
        case age
        case thumbnailURL = "thumbnailUrl"
        case rooms
    }
    
    public init(
        id: String,
        name: String,
        address: String,
        age: Int,
        thumbnailURL: String,
        rooms: [Room]
    ) {
        self.id = id
        self.name = name
        self.address = address
        self.age = age
        self.thumbnailURL = thumbnailURL
        self.rooms = rooms
    }
}
