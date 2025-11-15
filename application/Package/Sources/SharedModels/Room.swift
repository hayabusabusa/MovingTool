//
//  Room.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import Foundation

/// 物件に紐づく部屋のモデル.
public struct Room: Sendable, Identifiable, Hashable, Codable {
    /// 部屋ごとの ID.
    public let id: String
    /// 物件名
    public let name: String
    /// 物件の住所
    public let address: String
    /// 間取り
    public let layout: String
    /// 面積（平方メートル）
    public let area: Double
    /// 階数
    public let floor: Int
    /// 築年数
    public let age: Int
    /// 物件の賃料
    public let rent: Double
    /// 敷金
    public let securityDeposit: Double
    /// 礼金
    public let keyMoney: Double
    /// 物件の詳細ページURL
    public let url: String
    /// 最寄り駅情報一覧
    public let nearStations: [NearStation]
    /// 物件のサムネイル画像URL
    public let thumbnailURL: String
    /// 物件の画像URL一覧
    public let imageURLs: [String]

    private enum CodingKeys: String, CodingKey {
        case id
        case name
        case address
        case layout
        case area
        case floor
        case age
        case rent
        case securityDeposit
        case keyMoney
        case url
        case nearStations
        case thumbnailURL = "thumbnailUrl"
        case imageURLs = "imageUrls"
    }

    public init(
        id: String,
        name: String,
        address: String,
        layout: String,
        area: Double,
        floor: Int,
        age: Int,
        rent: Double,
        securityDeposit: Double,
        keyMoney: Double,
        url: String,
        nearStations: [NearStation],
        thumbnailURL: String,
        imageURLs: [String]
    ) {
        self.id = id
        self.name = name
        self.address = address
        self.layout = layout
        self.area = area
        self.floor = floor
        self.age = age
        self.rent = rent
        self.securityDeposit = securityDeposit
        self.keyMoney = keyMoney
        self.url = url
        self.nearStations = nearStations
        self.thumbnailURL = thumbnailURL
        self.imageURLs = imageURLs
    }
}

public extension Room {
    /// 最寄り駅情報のモデル.
    struct NearStation: Sendable, Hashable, Codable {
        /// 駅名
        public let name: String
        /// 駅から物件までの徒歩時間（分）
        public let walkTimeMinutes: Int
        
        public init(
            name: String,
            walkTimeMinutes: Int
        ) {
            self.name = name
            self.walkTimeMinutes = walkTimeMinutes
        }
    }
}
