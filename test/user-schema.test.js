const User = require('../lib/models/user-schema');
const testInvalid = require('./test-invalid')(User);
const assert = require('chai').assert;

describe('user schema', () => {
    it('requires name', () => {
        return testInvalid({ email: 'chlaw101@gmail.com' });
    });
    it('requires a password', () => {
        return testInvalid({ name: 'claire' });
    });
    it('requires email', () => {
        return testInvalid({ password: 'abc' });
    });
    it('is valid with name, email, password', () => {
        return new User({ name: 'claire', email: 'chlaw101@gmail.com', password: 'abc' }).validate();
    });
    it('sets hash from password and compares correctly', () => {
        const data = { name: 'claire', email: 'chlaw101@gmail.com', password: 'abc' };
        const user = new User(data);
        //password is undefined but the hash is
        assert.isUndefined(user.password);
        assert.isDefined(user.hash);
        //correct password comparison
        assert.isTrue(user.comparePassword('abc'));
        assert.isFalse(user.comparePassword('this is not the password'));
        //data password is user password
        assert.isTrue(user.comparePassword(data.password))
        assert.notEqual(user.hash, data.password);
    });
});