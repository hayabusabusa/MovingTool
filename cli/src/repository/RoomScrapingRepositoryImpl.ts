import { JSDOM } from "jsdom";

import type { Room } from "../model/index.ts";
import type { ScrapingRepository } from "./ScrapingRepository.ts";
import type { Logger } from "./Logger.ts";

/**
 * html ファイルを文字列で受け取り、賃貸物件情報を抽出する Repository の実装.
 */
export class RoomScrapingRepositoryImpl implements ScrapingRepository<Room[]> {
    constructor(private readonly logger: Logger) {}

    scrape(htmlText: string): Room[] {
        const dom = new JSDOM(htmlText);
        const document = dom.window.document;

        const rooms: Room[] = [];
        // cassetteitem クラスを持つ div 要素を全て取得（各物件の要素）
        const cassetteItems = document.querySelectorAll(".cassetteitem");
        cassetteItems.forEach((item, itemIndex) => {
            // 物件名を取得
            const titleElement = item.querySelector(".cassetteitem_content-title");
            const title = titleElement?.textContent?.trim();

            // 住所を取得
            const addressElement = item.querySelector(".cassetteitem_detail-col1");
            const address = addressElement?.textContent?.trim();

            // サムネイル URL を取得
            const thumbnailElement = item.querySelector(".js-noContextMenu.js-linkImage.js-adjustImg");
            const thumbnailUrl = thumbnailElement?.getAttribute("rel") || thumbnailElement?.getAttribute("src") || undefined;

            // 築年数を取得
            const ageElement = item.querySelector(".cassetteitem_detail-col3");
            const ageText = ageElement?.querySelector("div")?.textContent?.trim();
            let age: number | undefined;
            if (ageText === "新築") {
                // 新築の場合は 0 とする
                age = 0;
            } else {
                // "築8年" のような文字列から数値を抽出
                const ageMatch = ageText?.match(/築(\d+)年/);
                age = ageMatch?.[1] ? Number.parseInt(ageMatch[1], 10) : undefined;
            }
            
            // 必須項目が欠けている場合は物件情報の取得をスキップ
            if (
                title === undefined || 
                address === undefined || 
                thumbnailUrl === undefined || 
                age === undefined
            ) {
                const fields = {
                    title: title,
                    address: address,
                    thumbnailUrl: thumbnailUrl,
                    age: age,
                };
                this.logger.info(`Skipping item at index ${itemIndex} due to missing mandatory fields.`);
                this.logger.info(fields);
                return;
            }

            // 各部屋の情報を取得（js-cassette_link クラスを持つ tr 要素）
            const roomElements = item.querySelectorAll(".js-cassette_link");
            // 部屋ごとに RentalProperty を生成
            roomElements.forEach((room, roomIndex) => {
                // 詳細 URL を取得
                const urlElement = room.querySelector(".js-cassette_link_href.cassetteitem_other-linktext");
                const path = urlElement?.getAttribute("href");
                const url = path ? `https://suumo.jp${path}` : undefined;

                // ID は path の `chintai/jnc_000101337367/?bc=100466913782` となっている `bc=` 以降の値を利用する
                const id = path?.match(/bc=(\d+)/)?.[1];

                // 賃料を取得
                const rentElement = room.querySelector(".cassetteitem_other-emphasis.ui-text--bold");
                const rentText = rentElement?.textContent?.trim();
                // "7万円" のような文字列から数値を抽出（万円を円に変換）
                const rentMatch = rentText?.match(/([\d.]+)万円/);
                const rent = rentMatch?.[1] ? Number.parseFloat(rentMatch[1]) * 10000 : undefined;

                // 間取りを取得
                const layoutElement = room.querySelector(".cassetteitem_madori");
                const layout = layoutElement?.textContent?.trim();

                // 面積を取得
                const areaElement = room.querySelector(".cassetteitem_menseki");
                const areaText = areaElement?.textContent?.trim();
                // "26.08m²" のような文字列から数値を抽出
                const areaMatch = areaText?.match(/([\d.]+)m/);
                const area = areaMatch?.[1] ? Number.parseFloat(areaMatch[1]) : undefined;

                // 階を取得（3番目の td 要素）
                const tdElements = room.querySelectorAll("td");
                const floorText = tdElements[2]?.textContent?.trim();
                // "1階" のような文字列から数値を抽出
                const floorMatch = floorText?.match(/(\d+)階/);
                const floor = floorMatch?.[1] ? Number.parseInt(floorMatch[1], 10) : undefined;

                // 敷金を取得
                const securityDepositElement = room.querySelector(".cassetteitem_price--deposit");
                const securityDepositText = securityDepositElement?.textContent?.trim();
                let securityDeposit: number | undefined = undefined;
                // "-" の場合は 0 とする
                if (securityDepositText === "-") {
                    securityDeposit = 0;
                } else if (securityDepositText) {
                    // "3.5万円" のような文字列から数値を抽出（万円を円に変換）
                    const securityDepositMatch = securityDepositText.match(/([\d.]+)万円/);
                    securityDeposit = securityDepositMatch?.[1] ? Number.parseFloat(securityDepositMatch[1]) * 10000 : undefined;
                }

                // 礼金を取得
                const keyMoneyElement = room.querySelector(".cassetteitem_price--gratuity");
                const keyMoneyText = keyMoneyElement?.textContent?.trim();
                let keyMoney: number | undefined = undefined;
                if (keyMoneyText === "-") {
                    keyMoney = 0;
                } else if (keyMoneyText) {
                    // "3.5万円" のような文字列から数値を抽出（万円を円に変換）
                    const keyMoneyMatch = keyMoneyText.match(/([\d.]+)万円/);
                    keyMoney = keyMoneyMatch?.[1] ? Number.parseFloat(keyMoneyMatch[1]) * 10000 : undefined;
                }

                // 画像一覧を取得
                const imageUrlsElement = room.querySelector(".casssetteitem_other-thumbnail.js-view_gallery_images.js-noContextMenu");
                const imageUrlsText = imageUrlsElement?.getAttribute("data-imgs");
                const imageUrls = imageUrlsText ? imageUrlsText.split(",") : undefined;

                // 必須項目が欠けている場合は部屋情報の取得をスキップ
                if (
                    id === undefined || 
                    url === undefined || 
                    layout === undefined || 
                    area === undefined || 
                    floor === undefined || 
                    rent === undefined || 
                    securityDeposit === undefined || 
                    keyMoney === undefined || 
                    imageUrls === undefined
                ) {
                    const fields = {
                        id: id,
                        url: url,
                        layout: layout,
                        area: area,
                        floor: floor,
                        rent: rent,
                        securityDeposit: securityDeposit,
                        keyMoney: keyMoney,
                        imageUrls: imageUrls,
                    };
                    this.logger.info(`Skipping room at index (${itemIndex}, ${roomIndex}) due to missing mandatory fields.`);
                    this.logger.info(fields);
                    return;
                }

                // 物件データを構築
                const model: Room = {
                    id: id,
                    name: title,
                    address: address,
                    layout: layout,
                    area: area,
                    floor: floor,
                    age: age,
                    rent: rent,
                    securityDeposit: securityDeposit,
                    keyMoney: keyMoney,
                    url: url,
                    thumbnailUrl: thumbnailUrl,
                    imageUrls: imageUrls,
                };
                rooms.push(model);
            });
        });

        // データが 0 件の場合はエラーを投げる
        if (rooms.length === 0) {
            throw new Error("No rental properties found in the provided HTML.");
        }
        return rooms;
    }
}