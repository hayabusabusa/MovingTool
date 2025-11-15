//
//  MovingMapViewModel.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import APIClient
import Dependencies
import Foundation
import GeocodingClient
import Observation
import SharedModels

@Observable
@MainActor
public final class MovingMapViewModel {
    /// API 通信を行うクライアント.
    @ObservationIgnored
    @Dependency(\.apiClient)
    private var apiClient
    /// ジオコーディングを行うクライアント.
    @ObservationIgnored
    @Dependency(\.geocodingClient)
    private var geocodingClient

    private(set) var rooms = [Room]()
    private(set) var coordinateRooms = [Coordinate: [Room]]()

    public init() {}

    func task() {
        Task {
            do {
                let pageInformation = try await apiClient.fetchPageInformation()

                var allRooms = [Room]()
                for page in Array(1...pageInformation.totalPages) {
                    let rooms = try await apiClient.fetchRooms(page: page)
                    allRooms.append(contentsOf: rooms)
                }

                let addressGeocodedRooms = try await geocodingClient.appendCoordinate(rooms: allRooms)
                rooms = allRooms
                coordinateRooms = addressGeocodedRooms.reduce(into: [Coordinate: [Room]]()) { partialResult, addressGeocodedRoom in
                    guard let coordinate = addressGeocodedRoom.coordinate else {
                        return
                    }

                    if let rooms = partialResult[coordinate] {
                        partialResult[coordinate] = rooms + [addressGeocodedRoom.room]
                    } else {
                        partialResult[coordinate] = [addressGeocodedRoom.room]
                    }
                }
            } catch {
                print(error)
            }
        }
    }
}
