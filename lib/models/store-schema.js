const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//npm module that handles money calculations in mongoose
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const storeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        reqired: true
    },
    unit: {
        type: String,
        enum: [oz, gram, fl.oz, ml]
    }
});

//method unit price
storeSchema.methods.unitPrice = function() {
    return this.price / this.size;
}

module.exports = mongoose.model('Store', storeSchema);