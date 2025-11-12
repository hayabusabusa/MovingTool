import type { FetchRepository } from "./FetchRepository.ts";
import { FetchRepositoryImpl } from "./FetchRepository.ts";
import type { ScrapingRepository } from "./ScrapingRepository.ts";
import { PaginationScrapingRepositoryImpl } from "./PaginationScrapingRepositoryImpl.ts";
import { RentalPropertyScrapingRepositoryImpl } from "./RentalPropertyScrapingRepositoryImpl.ts";

export type { 
    FetchRepository,
    ScrapingRepository
};

export {
    FetchRepositoryImpl,
    PaginationScrapingRepositoryImpl,
    RentalPropertyScrapingRepositoryImpl
};