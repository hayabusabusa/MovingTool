//
//  AddressGeocodedRoom.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import Foundation

/// 物件に紐づく部屋の情報に座標を追加したモデル.
public struct AddressGeocodedRoom: Sendable, Hashable {
    /// 部屋の情報.
    public let room: Room
    /// 座標.
    ///
    /// - note: `Room.address` からジオコーディングして取得した座標なので、
    /// `Room.address` の内容によっては精度の低い座標になる可能性が高い.
    public let coordinate: Coordinate?

    public init(
        room: Room,
        coordinate: Coordinate?
    ) {
        self.room = room
        self.coordinate = coordinate
    }
}
