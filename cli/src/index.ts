#!/usr/bin/env node

import { consola } from "consola";

import { UseCase } from "./usecase/index.ts";
import { 
    FetchRepositoryImpl, 
    PaginationScrapingRepositoryImpl, 
    RentalPropertyScrapingRepositoryImpl
} from "./repository/index.ts";

const main = async () => {
    try {
        const useCase = new UseCase(
            new FetchRepositoryImpl(),
            new PaginationScrapingRepositoryImpl(),
            new RentalPropertyScrapingRepositoryImpl()
        );
        await useCase.execute();

        consola.success("[SUCCESS] All tasks completed successfully.");
    } catch (error) {
        consola.error("[ERROR] ", error);
    }  
};

main();