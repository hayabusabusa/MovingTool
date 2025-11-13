import { consola } from "consola";

export interface Logger {
    success(message: any): void;
    info(message: any): void;
    error(message: any): void;
}

export class LoggerImpl implements Logger {
    success(message: any): void {
        consola.success(message);
    }

    info(message: any): void {
        consola.info(message);
    }

    error(message: any): void {
        consola.error(message);
    }
}