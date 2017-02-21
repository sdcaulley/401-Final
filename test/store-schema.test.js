//const assert = require('chai').assert;
const Store = require('../lib/models/store-schema');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

describe('store schema', () => {
    it('example data with all fields', () => {
        const data = { name: 'Fred Meyer', brand: 'Kroger', price: '$3.44' };
        //requires all fields except unit
        return new Store(data).validate()
            .then(store => console.log(store))
            .catch(err => { throw err; });
    });
});