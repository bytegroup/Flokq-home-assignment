import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

export const rateLimit = (options: {
    windowMs: number;
    max: number;
    message?: string;
}) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const key = req.ip || 'unknown';
        const now = Date.now();

        if (!store[key] || now > store[key].resetTime) {
            store[key] = {
                count: 1,
                resetTime: now + options.windowMs,
            };
            next();
            return;
        }

        if (store[key].count >= options.max) {
            res.status(429).json({
                error: options.message || 'Too many requests, please try again later',
                retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
            });
            return;
        }

        store[key].count++;
        next();
    };
};

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
        if (now > store[key].resetTime) {
            delete store[key];
        }
    });
}, 60000); // Clean up every minute