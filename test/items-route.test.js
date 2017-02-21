const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;

const mongoose = require('mongoose');

const app = require('../lib/app');

const request = chai.request(app);

describe('ITEMS API ROUTE TESTS', () => {

    before(() => mongoose.connection.dropDatabase());

    it('GET returns an empty array of items', () => {
        return request.get('/items')
            .then(req => req.body)
            .then(items => assert.deepEqual(items, []));
    });


    // it('POST adds items via Item schema', () => {

    // });



});