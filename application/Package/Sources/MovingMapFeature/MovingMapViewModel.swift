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

    private(set) var coordinateRentalProperty = [Coordinate: [RentalProperty]]()

    var isModalPresented = false

    public init() {}

    func mapMarkerSelected(for coordinate: Coordinate) {
        guard coordinateRentalProperty[coordinate] != nil else {
            return
        }
        isModalPresented = true
    }

    func mapMarkerDeselected() {
        isModalPresented = false
    }

    func task() {
        Task {
            do {
                let pageInformation = try await apiClient.fetchPageInformation()

                var allProperties = [RentalProperty]()
                for page in Array(1...pageInformation.totalPages) {
                    let rentalProperties = try await apiClient.fetchRentalProperties(page: page)
                    allProperties.append(contentsOf: rentalProperties)
                }

                let addressGeocodedRentalProperties = try await geocodingClient.appendCoordinate(rentalProperties: allProperties)
                coordinateRentalProperty = addressGeocodedRentalProperties.reduce(into: [Coordinate: [RentalProperty]]()) { partialResult, addressGeocodedRentalProperty in
                    guard let coordinate = addressGeocodedRentalProperty.coordinate else {
                        return
                    }

                    if let rentalProperty = partialResult[coordinate] {
                        partialResult[coordinate] = rentalProperty + [addressGeocodedRentalProperty.rentalProperty]
                    } else {
                        partialResult[coordinate] = [addressGeocodedRentalProperty.rentalProperty]
                    }
                }
            } catch {
                print(error)
            }
        }
    }
}
