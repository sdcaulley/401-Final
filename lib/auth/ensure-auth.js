const token = require('./token');

module.exports = function getEnsureAuth() {
    return function ensureAuth(req, res) {
        const accessToken = req.get('authorization');
        token.verify(accessToken)
            .then(payload => {
                req.user = payload;
                next();
            })
            .catch(() => {
                next({
                    code: 401,
                    error: 'unauthorized'
                });
            });
    };
};