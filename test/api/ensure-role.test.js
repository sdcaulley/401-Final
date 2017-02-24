const ensureRole = require('../../lib/auth/ensure-role');
const assert = require('chai').assert;

describe('test ensureRole', () => {
    const res = {
        status(code) { this.code = code; return this; },
        send(error) { this.error = error; }
    };
    const req = {
        params: {
            role: 'owner'
        }
    };

    it(' no role returns error ', () => {
        ensureRole('user')(req, res, (obj) => {
            assert.equal(obj.code, 403);
            assert.equal(obj.error, 'unauthorized role');
        });
    });

    it(' user role returns true ', () => {
        ensureRole('owner')(req, res, () => {
            assert.isOk(1);
        });
    });
});