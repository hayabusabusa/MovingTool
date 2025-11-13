#!/usr/bin/env node

import { UseCase } from "./usecase/index.ts";
import { 
    FetchRepositoryImpl,
    FileRepositoryImpl,
    LoggerImpl,
    PaginationScrapingRepositoryImpl, 
    RentalPropertyScrapingRepositoryImpl
} from "./repository/index.ts";

const main = async () => {
    const logger = new LoggerImpl();

    try {    
        const useCase = new UseCase(
            new FetchRepositoryImpl(),
            new FileRepositoryImpl(),
            new PaginationScrapingRepositoryImpl(),
            new RentalPropertyScrapingRepositoryImpl(logger)
        );
        await useCase.execute();

        logger.success("All tasks completed successfully.");
    } catch (error) {
        logger.error(error);
    }  
};

main();