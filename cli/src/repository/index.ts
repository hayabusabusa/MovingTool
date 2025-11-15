import type { FetchRepository } from "./FetchRepository.ts";
import { FetchRepositoryImpl } from "./FetchRepository.ts";
import type { FileRepository } from "./FileRepository.ts";
import { FileRepositoryImpl } from "./FileRepository.ts";
import type { ScrapingRepository } from "./ScrapingRepository.ts";
import { PaginationScrapingRepositoryImpl } from "./PaginationScrapingRepositoryImpl.ts";
import { RoomScrapingRepositoryImpl } from "./RoomScrapingRepositoryImpl.ts";
import type { Logger } from "./Logger.ts";
import { LoggerImpl } from "./Logger.ts";

export type { 
    FetchRepository,
    FileRepository,
    Logger,
    ScrapingRepository
};

export {
    FetchRepositoryImpl,
    FileRepositoryImpl,
    LoggerImpl,
    PaginationScrapingRepositoryImpl,
    RoomScrapingRepositoryImpl
};