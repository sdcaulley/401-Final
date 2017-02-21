//const assert = require('chai').assert;
const Store = require('../lib/models/store-schema');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

describe.only('actor schema', () => {
    it('example data with all fields', () => {
        return new Store({ name: 'Fred Meyer', description: 'you can find anything at fred meyer', brand: 'Kroger', price: '$3.44', size: '12', type: 'oz' })
            .validate(Store)
            .then(store => console.log(store))
            .catch(err => { throw err; });
    });
});