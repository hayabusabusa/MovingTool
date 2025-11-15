//
//  MovingMapView.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import SwiftUI

public struct MovingMapView: View {
    @State private var viewModel: MovingMapViewModel

    public var body: some View {
        Text("Hello, World!")
    }

    public init(viewModel: MovingMapViewModel) {
        self.viewModel = viewModel
    }
}
