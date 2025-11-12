import { JSDOM } from "jsdom";

import type { ScrapingRepository } from "./ScrapingRepository.ts";

/**
 * html ファイルを文字列で受け取り、ページ数を抽出する Repository の実装.
 */
export class PaginationScrapingRepositoryImpl implements ScrapingRepository<number> {
    scrape(htmlText: string): number {
        const dom = new JSDOM(htmlText);
        const document = dom.window.document;

        // pagination-parts クラスを持つ ol 要素を取得
        const paginationElement = document.querySelector("ol.pagination-parts");
        
        // ol 要素が存在しない場合はページ数 1 を返す
        if (!paginationElement) {
            return 1;
        }

        // ol 要素内の全ての li 要素を取得
        const liElements = paginationElement.querySelectorAll("li");
        
        // 最後の li 要素から順に、数値が含まれる要素を探す
        for (let i = liElements.length - 1; i >= 0; i--) {
            const element = liElements[i];
            if (!element) continue;
            
            const text = element.textContent?.trim() || "";
            const pageNumber = Number.parseInt(text, 10);
            
            // 数値として有効な値が取得できた場合はそれを返す
            if (!Number.isNaN(pageNumber) && pageNumber > 0) {
                return pageNumber;
            }
        }

        return 0;
    }
}