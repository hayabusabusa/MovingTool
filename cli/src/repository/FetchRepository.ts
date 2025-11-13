/**
 * 指定した URL に GET リクエストを送信してレスポンスを受け取る Repository のインターフェース.
 */
export interface FetchRepository {
    /**
     * 指定した URL に GET リクエストを送信してレスポンスを受け取る.
     * @param url リクエストを送信する URL
     * @returns レスポンスデータを文字列にしたもの
     */
    fetch(url: string): Promise<string>;
}

/**
 * `fetch` を利用して指定した URL に GET リクエストを送信してレスポンスを受け取る Repository の実装クラス.
 */
export class FetchRepositoryImpl implements FetchRepository {
    async fetch(url: string): Promise<string> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return response.text();
    }
}