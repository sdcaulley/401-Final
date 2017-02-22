const Item = require('../../lib/models/item-schema');
const testInvalid = require('./test-invalid')(Item);

describe.skip('list schema', () => {
    it('requires name', () => {
        return testInvalid({ password: 'password' });
    });
});