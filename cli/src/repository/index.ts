import type { FetchRepository } from "./FetchRepository.ts";
import { FetchRepositoryImpl } from "./FetchRepository.ts";
import type { ScrapingRepository } from "./ScrapingRepository.ts";
import { PaginationScrapingRepositoryImpl } from "./PaginationScrapingRepositoryImpl.ts";
import { RentalPropertyScrapingRepositoryImpl } from "./RentalPropertyScrapingRepositoryImpl.ts";
import type { Logger } from "./Logger.ts";
import { LoggerImpl } from "./Logger.ts";

export type { 
    FetchRepository,
    Logger,
    ScrapingRepository
};

export {
    FetchRepositoryImpl,
    LoggerImpl,
    PaginationScrapingRepositoryImpl,
    RentalPropertyScrapingRepositoryImpl
};