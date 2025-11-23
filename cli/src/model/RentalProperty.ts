import type { Room } from "./Room.ts";

/**
 * 賃貸物件のモデル
 */
export interface RentalProperty {
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
     * 築年数
     */
    age: number;

    /**
    * 物件のサムネイル画像URL
    */
    thumbnailUrl: string;

    /**
     * 物件に紐づく部屋の一覧
     */
    rooms: Room[];
}