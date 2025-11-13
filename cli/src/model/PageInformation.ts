/**
 * スクレイピング対象ページの情報
 */
export interface PageInformation {
    /**
     * 総ページ数
     */
    totalPages: number;

    /**
     * 総物件数
     */
    totalProperties: number;

    /**
     * データ取得日時（UNIXタイムスタンプ）
     */
    updatedAt: number;
}