process.env.MONGODB_URI = 'mongodb://localhost:27017/shopper-test';
require('../lib/connection');
const mongoose = require('mongoose');

before(() => mongoose.connection.dropDatabase());

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../lib/app');
const request = chai.request(app);

before(() => {
    return request.post('/signup')
        .send({
            name: 'me',
            email: 'me@email.com',
            password: 'mepwd'
        })
        .then(data => {
            return data;
        })
        .catch();
});

before(() => {
    return request.post('/signup')
        .send({
            name: 'you',
            email: 'you@email.com',
            password: 'youpwd'
        })
        .then(data => {
            return data;
        })
        .catch();
});