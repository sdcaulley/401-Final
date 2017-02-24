module.exports = function getEnsureRole(role) {
    return function ensureRole(req, res, next) {
        const reqRole = req.params.role || req.get('role') || req.query.role;
        if (reqRole === role) {
            next();
        } else next({
            code: 403,
            error: 'unauthorized role'
        });
    };
};