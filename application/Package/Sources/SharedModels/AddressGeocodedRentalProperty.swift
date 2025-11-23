//
//  AddressGeocodedRentalProperty.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import Foundation

/// 物件の情報に座標を追加したモデル.
public struct AddressGeocodedRentalProperty: Sendable, Hashable {
    /// 物件の情報.
    public let rentalProperty: RentalProperty
    /// 座標.
    ///
    /// - note: `RentalProperty.address` からジオコーディングして取得した座標なので、
    /// `RentalProperty.address` の内容によっては精度の低い座標になる可能性が高い.
    public let coordinate: Coordinate?

    public init(
        rentalProperty: RentalProperty,
        coordinate: Coordinate?
    ) {
        self.rentalProperty = rentalProperty
        self.coordinate = coordinate
    }
}
