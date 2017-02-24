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
};

let storeTestOne = {
    name: 'Walmart',
    description: 'Somewhere',
    brand: 'Hillside',
    price: '$100.00',
    size: 10,
    unit: 'ml'
};
let storeTestTwo = {
    name: 'Trader Joes',
    description: 'Pearl',
    brand: 'Hummus',
    price: '$1.00',
    size: 50,
    unit: 'oz'
};

describe('store routes', () => {

    let token = '';

    before(() => {
        return User.findOne({ name: 'test' })
            .then(user => {
                console.log(user);
                return Token.sign(user.id);
            })
            .then(data => {
                return token = data;
            });
    });
    

    it('POST /stores - creates a store', () => {
        return request.post('/stores')
            .send(storeTest)
            .set('Authorization', token)
            .then(res => {
                storeTest.__v = res.body.__v;
                storeTest._id = res.body._id;
                assert.ok(storeTest._id);
            });
    });

    it('POST /stores - creates a store', () => {
        return request.post('/stores')
            .send(storeTestOne)
            .set('Authorization', token)
            .then(res => {
                storeTestOne.__v = res.body.__v;
                storeTestOne._id = res.body._id;
                assert.ok(storeTestOne._id);
            });
    });

    it('POST /stores - creates a store', () => {
        return request.post('/stores')
            .send(storeTestTwo)
            .set('Authorization', token)
            .then(res => {
                storeTestTwo.__v = res.body.__v;
                storeTestTwo._id = res.body._id;
                assert.ok(storeTestTwo._id);
            })
    });
    
    it('GET /stores - gets all stores and sorts by unit price highest to lowest', () => {
        return request.get('/stores')
            .set('Authorization', token)
            .then(res => {
                const itemStore = res.body[0];
                //we are saving a store for testing purposes in the items test so there is one exra store being saved
                console.log(res.body)
                assert.equal(res.body[0]._id, itemStore._id)
                assert.equal(res.body[1]._id, storeTestTwo._id);
                assert.equal(res.body[2]._id, storeTest._id);
                assert.equal(res.body[3]._id, storeTestOne._id);
                assert.equal(res.body[0].unitPrice, 0.2);
                assert.equal(res.body[1].unitPrice, 2);
                assert.equal(res.body[2].unitPrice, 20);
                assert.equal(res.body[3].unitPrice, 1000);
        });
    });


    it('GET /stores/:id - gets specific store by ID', () => {
        return request.get(`/stores/${storeTest._id}`)
            .set('Authorization', token)
            .then(req => req.body)
            .then(store => assert.equal(store.name, storeTest.name));
    });

    it('DELETE /stores/:id - deletes specific store by ID', () => {
        return request.delete(`/stores/${storeTest._id}`)
            .set('Authorization', token)
            .then(res => assert.isTrue(res.body.deleted));
    });

    it('DELETE /stores/:id - returns false if item does not exist', () => {
        return request.delete(`/stores/${storeTest._id}`)
            .set('Authorization', token)
            .then(res => assert.isFalse(res.body.deleted));
    });

    it('GET /stores/:id - returns 404 when store does not exist', () => {
        return request.get(`/stores/${storeTest._id}`)
            .set('Authorization', token)
            .then(
                () => { throw new Error('success status code not expected'); },
                res => {
                    assert.equal(res.status, 404);
                    assert.isOk(res.response.body.error);
                }
            );
    });


    it('PUT /stores/:id - updates store but we are doing a GET request in order to save store object', () => {
        return request.put(`/stores/${storeTestOne._id}`)
            .set('Authorization', token)
            .send({store_name: 'Whole Foods'})
            .then(res => {
                assert.deepEqual(res.body.name, 'Whole Foods');
            })
        });
    });

