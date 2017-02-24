const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const app = require('../../lib/app');


describe('authenticate credentials', () => {

    const user = {
        name: 'test',
        email: 'email@user.com',
        password: 'pwtest'
    };

    const request = chai.request(app);

    describe('user management', () => {
        const badRequest = (url, data, error) =>
            request
            .post(url)
            .send(data)
            .then(
                () => { throw new Error('status should not be okay'); },
                res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, error);
                }
            );
        it('signup requires username', () =>
            badRequest('/signup', { password: 'pwtest' }, 'username, password, and email must be supplied for signup')
        );

        it('signup requires password', () =>
            badRequest('/signup', { name: 'pwtest' }, 'username, password, and email must be supplied for signup')
        );

        it('signup requires email', () =>
            badRequest('/signup', { name: 'test', password: 'pwtest' }, 'username, password, and email must be supplied for signup')
        );

        let token = '';

        it('signup', () => {
            console.log('user in signup ', user);
            return request
                .post('/signup')
                .send(user)
                .then(res => {
                    token = res.body.token;
                    console.log('token in signup is ', token);
                    assert.ok(token);
                });
        });

        it.skip('can\'t use same username', () =>
            badRequest('/signup', user, 'username test already exists')
        );


        it('signin requires username', () =>
            badRequest('/signin', { password: 'abc' }, 'username and password must be supplied')
        );

        it('signin requires password', () =>
            badRequest('/signin', { name: 'abc' }, 'username and password must be supplied')
        );

        it('signin with wrong user', () =>
            badRequest('/signin', { name: 'bad user', password: user.password }, 'invalid username or password')
        );

        it('signin with wrong password', () =>
            badRequest('/signin', { name: user.name, password: 'bad' }, 'invalid username or password')
        );

        it('signin', () =>
            request
            .post('/signin')
            .send(user)
            .then(res => assert.ok(res.body.token))
        );


        it('token is invalid', () =>
            request
            .get('/verify')
            .set('Authorization', 'bad token')
            .then(
                () => { throw new Error('success response not expected'); },
                (res) => { assert.equal(res.status, 401); }
            )
        );

        it('token is valid', () =>
            request
            .get('/verify')
            .set('Authorization', token)
            .then(res => assert.ok(res.body))
        );


    });

    describe('unauthorized tokens', () => {

        it('401 with no token', () => {
            return request
                .get('/lists')
                .then(
                    () => { throw new Error('status should not be 200'); },
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'Unauthorized');
                    }
                );
        });

        it('403 with invalid token', () => {
            return request
                .get('/lists')
                .set('Authorization', 'badtoken')
                .then(
                    () => { throw new Error('status should not be 200'); },
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'Unauthorized');
                    }
                );
        });

        it('401 with no token', () => {
            return request
                .get('/items')
                .then(
                    () => { throw new Error('status should not be 200'); },
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'Unauthorized');
                    }
                );
        });
        it('403 with invalid token', () => {
            return request
                .get('/items')
                .set('Authorization', 'badtoken')
                .then(
                    () => { throw new Error('status should not be 200'); },
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'Unauthorized');
                    }
                );
        });

    });


});