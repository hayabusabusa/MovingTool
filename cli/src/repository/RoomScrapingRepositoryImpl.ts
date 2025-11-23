import { JSDOM } from "jsdom";

import type { Room, RentalProperty } from "../model/index.ts";
import type { ScrapingRepository } from "./ScrapingRepository.ts";
import type { Logger } from "./Logger.ts";
import type { NearStation } from "../model/Room.ts";

/**
 * html ファイルを文字列で受け取り、賃貸物件情報を抽出する Repository の実装.
 */
export class RoomScrapingRepositoryImpl implements ScrapingRepository<RentalProperty[]> {
    constructor(private readonly logger: Logger) { }

    scrape(htmlText: string): RentalProperty[] {
        const dom = new JSDOM(htmlText);
        const document = dom.window.document;

        const rentalProperties: RentalProperty[] = [];
        // cassetteitem クラスを持つ div 要素を全て取得（各物件の要素）
        const cassetteItems = document.querySelectorAll(".cassetteitem");
        cassetteItems.forEach((item, itemIndex) => {
            // 物件名を取得
            const propertyTitleElement = item.querySelector(".cassetteitem_content-title");
            const propertyTitle = propertyTitleElement?.textContent?.trim();

            // 住所を取得
            const propertyAddressElement = item.querySelector(".cassetteitem_detail-col1");
            const propertyAddress = propertyAddressElement?.textContent?.trim();

            // サムネイル URL を取得
            const propertyThumbnailElement = item.querySelector(".js-noContextMenu.js-linkImage.js-adjustImg");
            const propertyThumbnailUrl = propertyThumbnailElement?.getAttribute("rel") || propertyThumbnailElement?.getAttribute("src") || undefined;

            // 物件の ID はサムネイル URL に含まれる `100469381599_gw.jpg` となっているファイル名から数値の部分のみを抜き出したものを利用する
            const propertyThumbnailFileName = propertyThumbnailUrl?.split("/").pop();
            const properyID = propertyThumbnailFileName?.match(/^(\d+)/)?.[1];

            // 築年数を取得
            const propertyAgeElement = item.querySelector(".cassetteitem_detail-col3");
            const propertyAgeText = propertyAgeElement?.querySelector("div")?.textContent?.trim();
            let propertyAge: number | undefined;
            if (propertyAgeText === "新築") {
                // 新築の場合は 0 とする
                propertyAge = 0;
            } else {
                // "築8年" のような文字列から数値を抽出
                const ageMatch = propertyAgeText?.match(/築(\d+)年/);
                propertyAge = ageMatch?.[1] ? Number.parseInt(ageMatch[1], 10) : undefined;
            }

            // 最寄駅情報を取得
            const nearStationElements = item.querySelectorAll(".cassetteitem_detail-col2 .cassetteitem_detail-text");
            const nearStations = this.scrapeNearStations(nearStationElements);

            // 必須項目が欠けている場合は物件情報の取得をスキップ
            if (
                propertyTitle === undefined ||
                propertyAddress === undefined ||
                propertyThumbnailUrl === undefined ||
                properyID === undefined ||
                propertyAge === undefined
            ) {
                const fields = {
                    propertyTitle: propertyTitle,
                    propertyAddress: propertyAddress,
                    propertyThumbnailUrl: propertyThumbnailUrl,
                    properyID: properyID,
                    propertyAge: propertyAge,
                };
                this.logger.info(`Skipping item at index ${itemIndex} due to missing mandatory fields.`);
                this.logger.info(fields);
                return;
            }

            const rooms: Room[] = [];
            // 各部屋の情報を取得（js-cassette_link クラスを持つ tr 要素）
            const roomElements = item.querySelectorAll(".js-cassette_link");
            // 部屋ごとに RentalProperty を生成
            roomElements.forEach((room, roomIndex) => {
                // 詳細 URL を取得
                const urlElement = room.querySelector(".js-cassette_link_href.cassetteitem_other-linktext");
                const path = urlElement?.getAttribute("href");
                const url = path ? `https://suumo.jp${path}` : undefined;

                // ID は path の `chintai/jnc_000101337367/?bc=100466913782` となっている `jnc_` 以降の数値部分を利用する
                const id = path?.match(/jnc_(\d+)/)?.[1];

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

                // 管理費を取得
                const managementFeeElement = room.querySelector(".cassetteitem_price--administration");
                const managementFeeText = managementFeeElement?.textContent?.trim();
                let managementFee: number | undefined = undefined;
                if (managementFeeText === "-") {
                    managementFee = 0;
                } else if (managementFeeText) {
                    // "4000円" のような文字列から数値を抽出
                    const managementFeeMatch = managementFeeText.match(/([\d,]+)円/);
                    if (managementFeeMatch?.[1]) {
                        // カンマを除去して数値に変換
                        managementFee = Number.parseInt(managementFeeMatch[1].replace(/,/g, ""), 10);
                    }
                }

                // 画像一覧を取得
                const imageUrlsElement = room.querySelector(".casssetteitem_other-thumbnail.js-view_gallery_images.js-noContextMenu");
                const imageUrlsText = imageUrlsElement?.getAttribute("data-imgs");
                const imageUrls = imageUrlsText ? imageUrlsText.split(",") : undefined;

                // サムネイル URL を取得（_co.jpg で終わる URL を優先、なければ物件のサムネイルを使用）
                const thumbnailUrl = imageUrls?.find(url => url.endsWith("_co.jpg")) || propertyThumbnailUrl;

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
                    managementFee === undefined ||
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
                        managementFee: managementFee,
                        imageUrls: imageUrls,
                    };
                    this.logger.info(`Skipping room at index (${itemIndex}, ${roomIndex}) due to missing mandatory fields.`);
                    this.logger.info(fields);
                    return;
                }

                // 部屋データを構築
                const model: Room = {
                    id: id,
                    name: propertyTitle,
                    address: propertyAddress,
                    layout: layout,
                    area: area,
                    floor: floor,
                    age: propertyAge,
                    rent: rent,
                    managementFee: managementFee,
                    securityDeposit: securityDeposit,
                    keyMoney: keyMoney,
                    url: url,
                    nearStations: nearStations,
                    thumbnailUrl: thumbnailUrl,
                    imageUrls: imageUrls,
                };
                rooms.push(model);
            });

            // 部屋情報が1件もない場合は物件自体をスキップ
            if (rooms.length === 0) {
                this.logger.info(`Skipping property at index ${itemIndex} due to no valid rooms.`);
                return;
            }

            // 物件の情報を作成する
            const rentalProperty: RentalProperty = {
                id: properyID,
                name: propertyTitle,
                address: propertyAddress,
                age: propertyAge,
                thumbnailUrl: propertyThumbnailUrl,
                rooms: rooms,
            };
            rentalProperties.push(rentalProperty);
        });

        // データが 0 件の場合はエラーを投げる
        if (rentalProperties.length === 0) {
            throw new Error("No rental properties found in the provided HTML.");
        }
        return rentalProperties;
    }

    /**
     * 最寄駅情報を取得する
     * @param elements 最寄駅の要素
     * @returns 最寄駅の一覧
     */
    private scrapeNearStations(elements: NodeListOf<Element>): NearStation[] {
        const nearStations = Array.from(elements)
            .map(element => {
                const text = element.textContent?.trim();
                if (!text) {
                    return null;
                }

                // "京成本線/京成船橋駅 歩7分" のような文字列から駅名と徒歩時間を抽出、駅名部分は路線名を含めて取得する（"京成本線/京成船橋駅"）
                const match = text.match(/(.+?)\s+歩(\d+)分/);
                if (!match) {
                    return null;
                }

                const name = match[1]?.trim();
                const walkTimeMinutes = match[2] ? Number.parseInt(match[2], 10) : undefined;

                if (
                    name === undefined ||
                    walkTimeMinutes === undefined
                ) {
                    return null;
                }

                return {
                    name,
                    walkTimeMinutes,
                };
            })
            .filter((station): station is { name: string; walkTimeMinutes: number } => station !== null);
        return nearStations;
    }
}