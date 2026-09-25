import { Request, Response, NextFunction } from 'express';
export interface AdminPayload {
    id: string;
    name: string;
    email: string;
    isMainAdmin: boolean;
    permissions: Record<string, {
        view: boolean;
        edit: boolean;
        delete: boolean;
    }>;
}
declare global {
    namespace Express {
        interface Request {
            admin?: AdminPayload;
        }
    }
}
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=requireAuth.d.ts.map