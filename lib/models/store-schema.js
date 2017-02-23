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
        type: Currency,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        enum: ['oz', 'gram', 'fl.oz', 'ml', 'lb', 'each', 'gallon']
    }
});

//method unit price
// storeSchema.methods.unitPrice = function() {
//     this.unitPrice = this.price / this.size;
// };

// storeSchema.statics.sortPrice = function(stores) {
//     for (var i = 0; i < stores.length; i++) {
//         storeSchema.methods.unitPrice(store);
//     }
// }
storeSchema.virtual('unitPrice').get(function () {
    return this.price / this.size;
})

module.exports = mongoose.model('Store', storeSchema);