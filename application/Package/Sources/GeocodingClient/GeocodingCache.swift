//
//  GeocodingCache.swift
//  Package
//
//  Created by Shunya Yamada on 2025/11/15.
//

import Foundation
import SharedModels

/// 住所をキーにして座標をキャッシュとして保存する処理を行う `actor`.
final actor GeocodingCache {
    /// ファイル操作を行う `FileManager` のインスタンス.
    private let fileManager = FileManager.default
    /// キャッシュ読み込み時に利用するデコーダー.
    private let decoder = JSONDecoder()
    /// キャッシュ保存時に利用するエンコーダー.
    private let encoder = JSONEncoder()
    /// キャッシュ保存先ディレクトリのパス.
    private let path: URL

    init() {
        // キャッシュ保存用ディレクトリを作成.
        let url = fileManager.urls(
            for: .documentDirectory,
            in: .userDomainMask
        )[0]
        path = url.appending(
            path: "GeocodingClient.GeocodingCache",
            directoryHint: .isDirectory
        )
        try? fileManager.createDirectory(
            at: path,
            withIntermediateDirectories: true
        )
    }
    
    /// 座標をキャッシュに保存する
    /// - Parameters:
    ///   - coordinate: 保存する座標
    ///   - key: キー( 住所の文字列を想定 )
    func setCoordinate(
        _ coordinate: Coordinate,
        forKey key: String
    ) {
        var cache = storedCache
        cache[key] = coordinate
        saveCache(cache)
    }
    
    /// 保存した座標を読み込む
    /// - Parameter key: キー( 住所の文字列を想定 )
    /// - Returns: 保存済みの座標
    func coordinate(forKey key: String) -> Coordinate? {
        storedCache[key]
    }
}

private extension GeocodingCache {
    /// 保存先のファイル名.
    var fileURL: URL {
        path.appending(path: "data")
    }
    
    /// 保存されているキャッシュを返す.
    ///
    /// - note: 保存されていない場合は空の辞書配列を返す.
    var storedCache: [String: Coordinate] {
        guard let data = try? Data(contentsOf: fileURL),
              let decoded = try? decoder.decode([String: Coordinate].self, from: data) else {
            return [:]
        }
        return decoded
    }
    
    /// キャッシュを保存する.
    /// - Parameter cache: 保存するキャッシュ.
    func saveCache(_ cache: [String: Coordinate]) {
        guard let encoded = try? encoder.encode(cache) else {
            return
        }
        try? encoded.write(to: fileURL)
    }
}
