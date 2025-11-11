/**
 * 賃貸物件のモデル
 */
export interface RentalProperty {
    /**
     * ID
     */
    id: string;

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
     * 物件のサムネイル画像URL
     */
    thumbnailUrl: string;

    /**
     * 物件の画像URL一覧
     */
    imageUrls: string[];
}