module.exports = function getEnsureRole(role) {
    return function ensureRole(req, res, next) {
        if (req.params.role === role) {
            next();
        } else next({
            code: 403,
            error: 'unauthorized role'
        });
    };
};