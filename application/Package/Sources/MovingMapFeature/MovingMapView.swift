//
//  MovingMapView.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import CoreLocation
import MapKit
import PropertyDetailFeature
import SwiftUI
import SharedModels

public struct MovingMapView: View {
    @State private var viewModel: MovingMapViewModel
    @State private var cameraPosition: MapCameraPosition = .automatic
    @State private var selectedCoordinate: Coordinate?

    private var screenLongitude: Double?

    public var body: some View {
        MapReader { proxy in
            Map(
                position: $cameraPosition,
                selection: $selectedCoordinate
            ) {
                ForEach(
                    Array(viewModel.coordinateRentalProperty.keys),
                    id: \.self
                ) { coordinate in
                    Marker(coordinate: coordinate.locationCoordinate2D) {
                        Text("\(viewModel.coordinateRentalProperty[coordinate]?.count ?? 0)件")
                    }
                    .mapItemDetailSelectionAccessory(.callout)
                }

                if let selectedCoordinate {
                    MapCircle(
                        center: selectedCoordinate.locationCoordinate2D,
                        radius: 500
                    )
                    .foregroundStyle(.red.opacity(0.3))
                    .stroke(.red.opacity(0.5), lineWidth: 1)
                }
            }
            .onChange(of: selectedCoordinate) {
                if let selectedCoordinate {
                    viewModel.mapMarkerSelected(for: selectedCoordinate)
                    withAnimation {
                        cameraPosition = makeCameraPosition(
                            from: selectedCoordinate.locationCoordinate2D,
                            proxy: proxy
                        )
                    }
                } else {
                    viewModel.mapMarkerDeselected()
                }
            }
        }
        .sheet(isPresented: $viewModel.isModalPresented) {
            selectedCoordinate = nil
        } content: {
            if let selectedCoordinate,
               let rentalProperties = viewModel.coordinateRentalProperty[selectedCoordinate] {
                NavigationStack {
                    Text(rentalProperties.count.description)
                }
                .presentationDetents([.medium])
                .presentationBackgroundInteraction(.enabled)
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

// MARK: - Private

private extension MovingMapView {
    func makeCameraPosition(
        from coordinate: CLLocationCoordinate2D,
        proxy: MapProxy
    ) -> MapCameraPosition {
        guard let point = proxy.convert(coordinate, to: .local) else {
            return makeAmbiguousCameraPosition(from: coordinate)
        }
        let offsetPoint = CGPoint(
            x: point.x,
            y: point.y + 25
        )
        guard let offsetCoordinate = proxy.convert(offsetPoint, from: .local) else {
            return makeAmbiguousCameraPosition(from: coordinate)
        }
        return .camera(
            .init(
                centerCoordinate: offsetCoordinate,
                distance: 5000
            )
        )
    }

    func makeAmbiguousCameraPosition(from coordinate: CLLocationCoordinate2D) -> MapCameraPosition {
        .camera(
            .init(
                centerCoordinate: .init(
                    latitude: coordinate.latitude - 0.0065,
                    longitude: coordinate.longitude
                ),
                distance: 5000
            )
        )
    }
}
