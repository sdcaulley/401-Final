const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const app = require('../lib/app');
const request = chai.request(app);
const Token = require('../lib/auth/token');

describe('account api', () => {

    function saveResource(resource, route) {
        return request.post(route)
            .set('Authorization', token)
            .send(resource)
            .then(res => res.body);
    }

    let userAccount = {
        name: 'me',
        email: 'me@email.com',
        password: 'mepwd'
    };

    before(() => {
        return saveResource(userAccount, '/signup')
            .then(user => {
                return userAccount = user;
            });
    });

    let token = '';
    before(() => {
        return Token.sign(userAccount.id)
            .then(data => {
                return token = data;
            });
    });
});