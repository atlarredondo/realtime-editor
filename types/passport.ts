// types/passport.ts
import {type User as PrismaUser} from '../generated/prisma/client';
import 'ws';

declare global {
    namespace Express {
        // We target the global Express.User interface
        export interface User extends PrismaUser {}
    }
}

declare module 'express-session' {
    interface SessionData {
        passport: {
            user: number;
        };
    }
}

declare module 'ws' {
    // This extends the WebSocket class specifically from the 'ws' package
    interface WebSocket {
        userId?: number;
    }
}

// Crucial: This makes the file a module so the import works
export {};