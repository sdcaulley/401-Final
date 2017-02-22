const assert = require('chai').assert;
const Store = require('../../lib/models/store-schema');
const testInvalid = require('./test-invalid')(Store);
const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
mongoose.Promise = Promise;

describe.skip('store schema', () => {
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
    it('checks to see if this object is the same as the data we have', () => {
        const data = { name: 'Fred Meyer', brand: 'Kroger', price: 344 };
        const store = new Store(data);

        assert.equal(data.name, store.name);
        assert.equal(data.brand, store.brand);
        assert.equal(data.price, store.price);

    });
});