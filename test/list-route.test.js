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

    describe('list get routes', () => {

    });
});