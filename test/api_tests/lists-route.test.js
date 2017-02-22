const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const app = require('../lib/app');
const request = chai.request(app);

describe('list api', () => {

    let listOne = {
        name: 'List One',
        item: []
    };

    let itemOne = {
        name: 'cheese'
    };

    function saveResource(resource, route) {
        return request.post(route)
            .send(resource)
            .then(res => res.body);
    }

    describe('list POST routes', () => {
        it('create a new list', () => {
            return saveResource(listOne, '/lists')
                .then(savedList => {
                    assert.isOk(savedList._id);
                    listOne._id = savedList._id;
                    listOne.__v = 0;
                    assert.deepEqual(savedList, listOne);
                });
        });
        it('save existing item to list', () => {
            return saveResource(itemOne, '/items')
                .then(savedItem => {
                    itemOne = savedItem;
                    request.post(`/lists/${listOne._id}/additem`)
                        .send(savedItem)
                        .then(res => {
                            assert.include(res.body.item, savedItem._id);
                        });
                });
        });
    });

    describe('list GET routes', () => {
        it('GET all lists', () => {
            return request.get('/lists')
                .then(req => req.body)
                .then(res => {
                    assert.isArray(res);
                });
        });

        it('GET list by id', () => {
            return request.get(`/lists/${listOne._id}`)
                .then(res => {
                    assert.equal(res.body._id, listOne._id);
                });
        });
    });

    describe('list DELETE routes', () => {
        it('remove item from list', () => {
            return request.post(`/lists/${listOne._id}/removeitem`)
                .send({ itemID: itemOne._id })
                .then(res => {
                    assert.notInclude(res.body.item, itemOne._id);
                });
        });

        it('delete list', () => {
            return request.del(`/lists/${listOne._id}`)
                .then(res => {
                    assert.deepEqual(res.body, { deleted: true });
                });
        });
    });

});