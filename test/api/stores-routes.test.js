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
        price: '$5.00',
        size: 25,
        unit: 'ml'
}
let storeTestOne = {
        name: 'Walmart',
        description: 'Somewhere',
        brand: 'Hillside',
        price: '$100.00',
        size: 10,
        unit: 'ml'
}
let storeTestTwo = {
        name: 'Trader Joes',
        description: 'Pearl',
        brand: 'Hummus',
        price: '$1.00',
        size: 50,
        unit: 'oz'
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
    it('creates a store', () => {
        return request.post('/stores')
            .send(storeTestOne)
            .set('Authorization', token)
            .then(res => {
                storeTestOne.__v = res.body.__v;
                storeTestOne._id = res.body._id;
                assert.ok(storeTestOne._id);
            })
    });
    it('creates a store', () => {
        return request.post('/stores')
            .send(storeTestTwo)
            .set('Authorization', token)
            .then(res => {
                storeTestTwo.__v = res.body.__v;
                storeTestTwo._id = res.body._id;
                assert.ok(storeTestTwo._id);
            })
    });
    it('gets all stores and sorts by unit price highest to lowest', () => {
        return request.get('/stores')
            .set('Authorization', token)
            .then(res => {
                console.log(res.body);
                assert.equal(res.body[0]._id, storeTestTwo._id);
                assert.equal(res.body[1]._id, storeTest._id);
                assert.equal(res.body[2]._id, storeTestOne._id);
                assert.equal(res.body[0].unitPrice, 2);
                assert.equal(res.body[1].unitPrice, 20);
                assert.equal(res.body[2].unitPrice, 1000);
        }); 
    });
});