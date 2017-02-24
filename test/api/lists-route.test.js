const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const app = require('../../lib/app');
const request = chai.request(app);
const User = require('../../lib/models/user-schema');
const Token = require('../../lib/auth/token');

describe('list api', () => {

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

    let listOne = {
        name: 'List One',
        item: []
    };

    let itemOne = {
        name: 'cheese'
    };

    function saveResource(resource, route) {
        return request.post(route)
            .set('Authorization', token)
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
        // it('save existing item to list', () => {
        //     return saveResource(itemOne, '/items')
        //         .then(savedItem => {
        //             itemOne = savedItem;
        //             request.post(`/lists/${listOne._id}/additem`)
        //                 .set('Authorization', token)
        //                 .send(savedItem)
        //                 .then(res => {
        //                     assert.include(res.body.item, savedItem._id);
        //                 });
        //         });
        // });
    });

    describe('list GET routes', () => {
        it('GET all lists', () => {
            return request.get('/lists')
                .set('Authorization', token)
                .then(res => {
                    assert.isArray(res.body);
                });
        });

        it('GET list by id', () => {
            return request.get(`/lists/${listOne._id}`)
                .set('Authorization', token)
                .then(res => {
                    assert.equal(res.body._id, listOne._id);
                });
        });
    });

    describe('list DELETE routes', () => {
        it('remove item from list', () => {
            return request.post(`/lists/${listOne._id}/removeitem`)
                .set('Authorization', token)
                .send({ itemID: itemOne._id })
                .then(res => {
                    assert.notInclude(res.body.item, itemOne._id);
                });
        });

        it('delete list', () => {
            return request.del(`/lists/${listOne._id}`)
                .set('Authorization', token)
                .then(res => {
                    assert.deepEqual(res.body, { deleted: true });
                });
        });
    });

});