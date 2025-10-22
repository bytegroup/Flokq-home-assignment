import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.path} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
            Logger.error(message);
        } else if (res.statusCode >= 400) {
            Logger.warn(message);
        } else {
            Logger.info(message);
        }
    });

    next();
};