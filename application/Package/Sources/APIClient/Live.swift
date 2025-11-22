//
//  Live.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import Foundation
import Dependencies
import SharedModels

extension APIClient: DependencyKey {
    public static var liveValue: APIClient {
        let configuration = URLSessionConfiguration.default
        let session = URLSession(configuration: configuration)
        let decoder = JSONDecoder()

        return .init {
            let request = try makeURLRequest(path: "pi.json")
            let (data, _) = try await session.data(for: request)
            let decoded = try decoder.decode(PageInformation.self, from: data)
            return decoded
        } fetchRooms: { page in
            let request = try makeURLRequest(path: "\(page).json")
            let (data, _) = try await session.data(for: request)
            let decoded = try decoder.decode([Room].self, from: data)
            return decoded
        }
    }
}

private extension APIClient {
    /// 指定されたパスを含めた URL からリクエスト情報を作成する.
    /// - Parameter path: リクエスト先のパス.
    /// - Returns: リクエスト情報である `URLRequest`.
    static func makeURLRequest(path: String) throws -> URLRequest {
        guard let baseURL = URL(string: "https://raw.githubusercontent.com/hayabusabusa/MovingTool/refs/heads/main/cli/output/") else {
            throw URLError(.badURL)
        }
        let url = baseURL.appending(path: path)
        let request = URLRequest(url: url)
        return request
    }
}
