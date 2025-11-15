//
//  Live.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import Dependencies
import Foundation
import MapKit
import SharedModels

extension GeocodingClient: DependencyKey {
    public static var liveValue: GeocodingClient {
        let cache = GeocodingCache()

        return .init { rooms in
            // 並列でジオコーディングの処理を行う
            await withTaskGroup(
                of: AddressGeocodedRoom.self,
                returning: [AddressGeocodedRoom].self
            ) { group in
                for room in rooms {
                    group.addTask {
                        // キャッシュ済みの座標の場合はキャッシュから読み込んで返す
                        if let cachedCoordinate = await cache.coordinate(forKey: room.address) {
                            return AddressGeocodedRoom(
                                room: room,
                                coordinate: cachedCoordinate
                            )
                        }
                        // エラー時は座標を `nil` として扱いたいため、エラーを握りつぶす
                        guard let request = MKGeocodingRequest(addressString: room.address),
                              let mapItems = try? await request.mapItems,
                              let locationCoordinate = mapItems.first?.location.coordinate else {
                            return AddressGeocodedRoom(
                                room: room,
                                coordinate: nil
                            )
                        }
                        let coordinate = Coordinate(
                            latitude: locationCoordinate.latitude,
                            longitude: locationCoordinate.longitude
                        )
                        // キャッシュに保存する
                        await cache.setCoordinate(
                            coordinate,
                            forKey: room.address
                        )
                        return AddressGeocodedRoom(
                            room: room,
                            coordinate: coordinate
                        )
                    }
                }

                var addressGeocodedRooms = [AddressGeocodedRoom]()
                for await addressGeocodedRoom in group {
                    addressGeocodedRooms.append(addressGeocodedRoom)
                }
                return addressGeocodedRooms
            }
        }
    }
}
