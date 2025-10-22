import { User } from '@prisma/client';

declare global {
    namespace Express {
        interface User {
            id: number;
            name: string;
            email: string;
            passwordHash: string;
            createdAt: Date;
        }

        interface Request {
            userId?: number;
        }
    }
}

export {};