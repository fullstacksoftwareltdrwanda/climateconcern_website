"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
exports.requireMainAdmin = requireMainAdmin;
/**
 * Returns a middleware that checks whether the authenticated admin
 * has the required permission for a given section.
 *
 * Usage: router.delete('/:id', requireAuth, requirePermission('team', 'delete'), handler)
 */
function requirePermission(section, action) {
    return (req, res, next) => {
        const admin = req.admin;
        if (!admin) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // Main admin always has full access
        if (admin.isMainAdmin) {
            next();
            return;
        }
        const sectionPerms = admin.permissions[section];
        if (!sectionPerms || !sectionPerms[action]) {
            res.status(403).json({ error: `Forbidden — missing ${section}.${action} permission` });
            return;
        }
        next();
    };
}
/**
 * Convenience: requires main admin status (for admin management routes).
 */
function requireMainAdmin(req, res, next) {
    if (!req.admin) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!req.admin.isMainAdmin) {
        res.status(403).json({ error: 'Forbidden — main admin only' });
        return;
    }
    next();
}
//# sourceMappingURL=requirePermission.js.map