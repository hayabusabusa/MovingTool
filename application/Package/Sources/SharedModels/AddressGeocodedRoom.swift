//
//  AddressGeocodedRoom.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import Foundation

public struct AddressGeocodedRoom: Sendable, Hashable {
    public let room: Room
    public let coordinate: Coordinate?

    public init(
        room: Room,
        coordinate: Coordinate?
    ) {
        self.room = room
        self.coordinate = coordinate
    }
}
