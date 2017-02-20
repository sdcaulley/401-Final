//TODO do we want Store and Price here, and how does that information get here?

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    date: {
        type: Date,
        required: true
    },
    store: {

    },
    price: {}
});

const Purchase = mongoose.model('Purchase', schema);
module.exports = Purchase;