const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;
const mongoose = require('mongoose');
const app = require('../lib/app');
const request = chai.request(app);

describe('list api', () => {
    before(() => {
        mongoose.connection.dropDatabase();
    });

    let listOne = {
        name: 'List One',
        item: []
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
                    assert.deepEqual(res.body, listOne);
                });
        });
    });

});