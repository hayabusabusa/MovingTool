/**
 * HTML を `string` として受け取り、パースを行う Repository のインターフェース.
 */
export interface ScrapingRepository<T> {
    /**
     * 指定した文字列を HTML としてパースを行う.
     * @param htmlText HTML としてパースする文字列
     * @returns パースされたデータ
     */
    scrape(htmlText: string): T;
}