import { Request, Response, NextFunction } from 'express';
type PermissionAction = 'view' | 'edit' | 'delete';
/**
 * Returns a middleware that checks whether the authenticated admin
 * has the required permission for a given section.
 *
 * Usage: router.delete('/:id', requireAuth, requirePermission('team', 'delete'), handler)
 */
export declare function requirePermission(section: string, action: PermissionAction): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Convenience: requires main admin status (for admin management routes).
 */
export declare function requireMainAdmin(req: Request, res: Response, next: NextFunction): void;
export {};
//# sourceMappingURL=requirePermission.d.ts.map