//
//  MovingMapView.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import MapKit
import SwiftUI

public struct MovingMapView: View {
    @State private var viewModel: MovingMapViewModel

    public var body: some View {
        Map {
            ForEach(
                Array(viewModel.coordinateRooms.keys),
                id: \.self
            ) { coordinate in
                Marker(coordinate: coordinate.locationCoordinate2D) {
                    Text("\(viewModel.coordinateRooms[coordinate]?.count ?? 0)件")
                }
            }
        }
        .task {
            viewModel.task()
        }
    }

    public init(viewModel: MovingMapViewModel) {
        self.viewModel = viewModel
    }
}
