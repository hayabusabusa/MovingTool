import { JSDOM } from "jsdom";

import type { RentalProperty } from "../model/index.ts";
import type { ScrapingRepository } from "./ScrapingRepository.ts";

/**
 * html ファイルを文字列で受け取り、賃貸物件情報を抽出する Repository の実装.
 */
export class RentalPropertyScrapingRepositoryImpl implements ScrapingRepository<RentalProperty[]> {
    scrape(htmlText: string): RentalProperty[] {
        const dom = new JSDOM(htmlText);
        const document = dom.window.document;

        // ここで document を使って必要なデータを抽出し、RentalProperty[] を生成する
        const properties: RentalProperty[] = [];

        // cassetteitem クラスを持つ div 要素を全て取得（各物件の要素）
        const cassetteItems = document.querySelectorAll(".cassetteitem");

        cassetteItems.forEach((item, itemIndex) => {
            // 物件名を取得
            const titleElement = item.querySelector(".cassetteitem_content-title");
            const title = titleElement?.textContent?.trim() || "";

            // 住所を取得
            const addressElement = item.querySelector(".cassetteitem_detail-col1");
            const address = addressElement?.textContent?.trim() || "";

            // サムネイル URL を取得
            const thumbnailElement = item.querySelector(".js-noContextMenu.js-linkImage.js-adjustImg");
            const thumbnailUrl = thumbnailElement?.getAttribute("rel") || thumbnailElement?.getAttribute("src") || "";

            // 築年数を取得
            const ageElement = item.querySelector(".cassetteitem_detail-col3");
            const ageText = ageElement?.querySelector("div")?.textContent?.trim() || "";
            // "築8年" のような文字列から数値を抽出
            const ageMatch = ageText.match(/築(\d+)年/);
            const age = ageMatch?.[1] ? Number.parseInt(ageMatch[1], 10) : 0;

            // 各部屋の情報を取得（js-cassette_link クラスを持つ tr 要素）
            const roomElements = item.querySelectorAll(".js-cassette_link");
            // 部屋ごとに RentalProperty を生成
            roomElements.forEach((room, roomIndex) => {
                // 賃料を取得
                const rentElement = room.querySelector(".cassetteitem_other-emphasis.ui-text--bold");
                const rentText = rentElement?.textContent?.trim() || "";
                // "7万円" のような文字列から数値を抽出（万円を円に変換）
                const rentMatch = rentText.match(/([\d.]+)万円/);
                const rent = rentMatch?.[1] ? Number.parseFloat(rentMatch[1]) * 10000 : 0;

                // 間取りを取得
                const layoutElement = room.querySelector(".cassetteitem_madori");
                const layout = layoutElement?.textContent?.trim() || "";

                // 面積を取得
                const areaElement = room.querySelector(".cassetteitem_menseki");
                const areaText = areaElement?.textContent?.trim() || "";
                // "26.08m²" のような文字列から数値を抽出
                const areaMatch = areaText.match(/([\d.]+)m/);
                const area = areaMatch?.[1] ? Number.parseFloat(areaMatch[1]) : 0;

                // 階を取得（3番目の td 要素）
                const tdElements = room.querySelectorAll("td");
                const floorText = tdElements[2]?.textContent?.trim() || "";
                // "1階" のような文字列から数値を抽出
                const floorMatch = floorText.match(/(\d+)階/);
                const floor = floorMatch?.[1] ? Number.parseInt(floorMatch[1], 10) : 0;

                // 敷金を取得
                const securityDepositElement = room.querySelector(".cassetteitem_price--deposit");
                const securityDepositText = securityDepositElement?.textContent?.trim() || "";
                let securityDeposit = 0;
                if (securityDepositText !== "-") {
                    // "3.5万円" のような文字列から数値を抽出（万円を円に変換）
                    const securityDepositMatch = securityDepositText.match(/([\d.]+)万円/);
                    securityDeposit = securityDepositMatch?.[1] ? Number.parseFloat(securityDepositMatch[1]) * 10000 : 0;
                }

                // 礼金を取得
                const keyMoneyElement = room.querySelector(".cassetteitem_price--gratuity");
                const keyMoneyText = keyMoneyElement?.textContent?.trim() || "";
                let keyMoney = 0;
                if (keyMoneyText !== "-") {
                    // "3.5万円" のような文字列から数値を抽出（万円を円に変換）
                    const keyMoneyMatch = keyMoneyText.match(/([\d.]+)万円/);
                    keyMoney = keyMoneyMatch?.[1] ? Number.parseFloat(keyMoneyMatch[1]) * 10000 : 0;
                }

                // 詳細 URL を取得
                const urlElement = room.querySelector(".js-cassette_link_href.cassetteitem_other-linktext");
                const path = urlElement?.getAttribute("href") || "";
                const url = `https://suumo.jp${path}`;

                // 画像一覧を取得
                const imageUrlsElement = room.querySelector(".casssetteitem_other-thumbnail.js-view_gallery_images.js-noContextMenu");
                const imageUrlsText = imageUrlsElement?.getAttribute("data-imgs") || "";
                const imageUrls = imageUrlsText ? imageUrlsText.split(",") : [];

                if (title) {
                    properties.push({
                        id: `property-${itemIndex}-room-${roomIndex}`,
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
                    });
                }
            });
        });

        // データが 0 件の場合はエラーを投げる
        if (properties.length === 0) {
            throw new Error("No rental properties found in the provided HTML.");
        }

        return properties;
    }
}