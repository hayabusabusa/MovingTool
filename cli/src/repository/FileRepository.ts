import fs from "fs";
import path from "path";

/**
 * ファイル操作を行うリポジトリのインターフェース.
 */
export interface FileRepository {
    /**
     * 指定したパスに文字列データを保存する.
     * @param filePath 保存先のファイルパス
     * @param data 保存する文字列データ
     */
    save(filePath: string, data: string): Promise<void>;
}

/**
 * ファイル操作を行うリポジトリの実装.
 */
export class FileRepositoryImpl implements FileRepository {
    async save(filePath: string, data: string): Promise<void> {
        const dir = path.dirname(filePath);
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(filePath, data, "utf-8");
    }
}