const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const User = require('../../lib/models/user-schema');
const Token = require('../../lib/auth/token');

const app = require('../../lib/app');

const request = chai.request(app);

let storeTest = {
        name: 'Fred Meyer',
        description: 'Burlingame Fred Meyer',
        brand: 'Alpenrose',
        price: '$2.00',
        size: 1000,
        unit: 'ml'
}

describe('store routes', () => {
    let token = '';
    before(() => {
        return User.findOne({ name: 'test' })
            .then(user => {
                return Token.sign(user.id);
            })
            .then(data => {
                return token = data;
            });
    });
    it('creates a store', () => {
        return request.post('/stores')
            .send(storeTest)
            .set('Authorization', token)
            .then(res => {
                storeTest.__v = res.body.__v;
                storeTest._id = res.body._id;
                assert.ok(storeTest._id);
            })
    });
    it('gets all stores', () => {
        return request.get('/stores')
            .set('Authorization', token)
            .then(res => {
                console.log(res.body);
        }); 
    });
});