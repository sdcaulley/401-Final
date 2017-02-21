//const assert = require('chai').assert;
const Store = require('../lib/models/store-schema');
const testInvalid = require('./test-invalid')(Store);
const mongoose = require('mongoose');

mongoose.Promise = Promise;

describe('store schema', () => {
    it('requires name', () => {
        return testInvalid({ brand: 'Kroger' });
    });
    it('requires brand', () => {
        return testInvalid({ price: '$3.88' });
    });
    it('requires price', () => {
        return testInvalid({ name: 'Fred Meyer' });
    });
    it('is valid with name, brand, and price', () => {
        return new Store({ name: 'Fred Meyer', brand: 'Kroger', price: '$3.88' }).validate();
    });
    it('example data with all fields', () => {
        const data = { name: 'Fred Meyer', brand: 'Kroger', price: '$3.44' };
        //requires all fields except unit
        return new Store(data).validate()
            .then(store => console.log(store))
            .catch(err => { throw err; });
    });
});