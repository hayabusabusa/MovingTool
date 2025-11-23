/**
 * 物件に紐づく部屋のモデル
 */
export interface Room {
    /**
     * ID
     */
    id: string;

    /**
     * 物件名
     */
    name: string;

    /**
     * 物件の住所
     */
    address: string;

    /**
     * 間取り
     */
    layout: string;

    /**
     * 面積（平方メートル）
     */
    area: number;

    /**
     * 階数
     */
    floor: number;
    
    /**
     * 築年数
     */
    age: number;

    /**
     * 物件の賃料
     */
    rent: number;

    /**
     * 管理費・共益費
     */
    managementFee: number;

    /**
     * 敷金
     */
    securityDeposit: number;

    /**
     * 礼金
     */
    keyMoney: number;

    /**
     * 物件の詳細ページURL
     */
    url: string;

    /**
     * 最寄り駅情報一覧
     */
    nearStations: NearStation[];

    /**
     * 物件のサムネイル画像URL
     */
    thumbnailUrl: string;

    /**
     * 物件の画像URL一覧
     */
    imageUrls: string[];
}

/**
 * 最寄り駅情報のモデル
 */
export interface NearStation {
    /**
     * 駅名
     */
    name: string;

    /**
     * 駅までの徒歩時間（分）
     */
    walkTimeMinutes: number;
}