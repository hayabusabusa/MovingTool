//
//  AppView.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import MovingMapFeature
import SwiftUI

public struct AppView: View {
    public var body: some View {
        NavigationStack {
            MovingMapView(viewModel: MovingMapViewModel())
        }
    }

    public init() {}
}
