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

        return .init { rentalProperties in
            // 並列でジオコーディングの処理を行う
            await withTaskGroup(
                of: AddressGeocodedRentalProperty.self,
                returning: [AddressGeocodedRentalProperty].self
            ) { group in
                for rentalProperty in rentalProperties {
                    group.addTask {
                        // キャッシュ済みの座標の場合はキャッシュから読み込んで返す
                        if let cachedCoordinate = await cache.coordinate(forKey: rentalProperty.address) {
                            return AddressGeocodedRentalProperty(
                                rentalProperty: rentalProperty,
                                coordinate: cachedCoordinate
                            )
                        }
                        // エラー時は座標を `nil` として扱いたいため、エラーを握りつぶす
                        guard let request = MKGeocodingRequest(addressString: rentalProperty.address),
                              let mapItems = try? await request.mapItems,
                              let locationCoordinate = mapItems.first?.location.coordinate else {
                            return AddressGeocodedRentalProperty(
                                rentalProperty: rentalProperty,
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
                            forKey: rentalProperty.address
                        )
                        return AddressGeocodedRentalProperty(
                            rentalProperty: rentalProperty,
                            coordinate: coordinate
                        )
                    }
                }

                var addressGeocodedRooms = [AddressGeocodedRentalProperty]()
                for await addressGeocodedRoom in group {
                    addressGeocodedRooms.append(addressGeocodedRoom)
                }
                return addressGeocodedRooms
            }
        }
    }
}
