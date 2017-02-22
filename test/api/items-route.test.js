const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const User = require('../lib/models/user-schema');
const Token = require('../lib/auth/token');

const app = require('../../lib/app');

const request = chai.request(app);

describe('ITEMS API ROUTE TESTS', () => {

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

    it('GET /items returns an empty array', () => {
        return request.get('/items')
            .set('Authorization', token)
            .then(req => req.body)
            .then(items => assert.deepEqual(items, []));
    });

    let cheese = { name: 'cheese' };
    let stinkyCheese = { name: 'stinky cheese' };
    let worldsWorst = { name: 'world\'s stinkiest cheese' };

    function saveItem(item) {
        return request.post('/items')
            .set('Authorization', token)
            .send(item)
            .then(res => res.body);
    }

    it('POST /items adds item via Item schema', () => {
        return saveItem(cheese)
            .then(savedItem => {
                assert.isOk(savedItem._id);
                cheese._id = savedItem._id;
                assert.equal(savedItem.name, cheese.name);
            });
    });

    it('GET /items returns list of items', () => {
        return Promise.all([saveItem(stinkyCheese), saveItem(worldsWorst)])
            .then(() => request.get('/items')
                .set('Authorization', token))
            .then(res => {
                const items = res.body;
                assert.equal(items.length, 3);
                assert.equal(items[2].name, worldsWorst.name);
            });
    });

    it('GET /items/:id returns item by ID', () => {
        return request.get(`/items/${cheese._id}`)
            .set('Authorization', token)
            .then(req => req.body)
            .then(item => assert.equal(item.name, cheese.name));
    });

    it('DELETE /items/:id deletes item by ID', () => {
        return request.delete(`/items/${cheese._id}`)
            .set('Authorization', token)
            .then(res => assert.isTrue(res.body.deleted));
    });

    it('DELETE /items/:id returns false if item does not exist', () => {
        return request.delete(`/items/${cheese._id}`)
            .set('Authorization', token)
            .then(res => assert.isFalse(res.body.deleted));
    });

    it('GET /items/:id returns 404 when item does not exist', () => {
        return request.get(`/items/${cheese._id}`)
            .set('Authorization', token)
            .then(
                () => { throw new Error('success status code not expected'); },
                res => {
                    assert.equal(res.status, 404);
                    assert.isOk(res.response.body.error);
                }
            );
    });

    it('GET /items confirms item removed from list', () => {
        return request.get('/items')
            .set('Authorization', token)
            .then(req => req.body)
            .then(items => assert.equal(items.length, 2));
    });

});