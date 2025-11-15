import type { FetchRepository, FileRepository, ScrapingRepository } from "../repository/index.ts";
import type { PageInformation, Room } from "../model/index.ts";

export class UseCase {
    constructor(
        private readonly fetchRepository: FetchRepository,
        private readonly fileRepository: FileRepository,
        private readonly paginationScrapingRepository: ScrapingRepository<number>,
        private readonly roomScrapingRepository: ScrapingRepository<Room[]>
    ) {}

    async execute(): Promise<void> {
        const url = "https://suumo.jp/jj/chintai/ichiran/FR301FC001/?ar=030&bs=040&ra=012&rn=0573&ek=057334480&ek=057329360&ek=057302990&ae=05731&cb=7.0&ct=10.0&mb=25&mt=9999999&md=02&md=03&md=04&et=15&cn=20&co=1&kz=1&kz=2&tc=0400301&shkr1=03&shkr2=03&shkr3=03&shkr4=03&sngz=&po1=09&pc=50";
        const html = await this.fetchRepository.fetch(url);
        const totalPages = this.paginationScrapingRepository.scrape(html);

        // 全ページの HTML 
        let htmls = [html];
        // 2ページ目以降のHTMLを並列で取得
        if (totalPages >= 2) {
            // 2ページ目以降のURLを生成
            const pageUrls = Array.from({ length: totalPages - 1 }, (_, i) => {
                const pageNumber = i + 2; // 2ページ目から開始
                return `${url}&page=${pageNumber}`;
            });

            // 並列でHTMLを取得
            const htmlPages = await Promise.all(
                pageUrls.map(pageUrl => this.fetchRepository.fetch(pageUrl))
            );

            htmls.push(...htmlPages);
        }

        // 各ページの物件情報をスクレイピング
        const allRooms = htmls.map((element) => this.roomScrapingRepository.scrape(element));
        // ページ情報を作成
        const pageInformation: PageInformation = {
            totalPages: totalPages,
            totalProperties: allRooms.reduce((sum, rooms) => sum + rooms.length, 0),
            updatedAt: Math.floor(Date.now() / 1000),
        };

        const path = "./output";
        // 各ページの物件情報をJSONファイルとして保存
        await Promise.all(
            allRooms.map((rooms, index) => this.fileRepository.save(`${path}/${index + 1}.json`, JSON.stringify(rooms, null, 2)))
        );
        // ページ情報をJSONファイルとして保存
        await this.fileRepository.save(`${path}/pi.json`, JSON.stringify(pageInformation, null, 2));
    }
}