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
        enum: ['oz', 'gram', 'fl.oz', 'ml', 'lb']
    }
});



storeSchema.statics.sortPrice = function() {
    const pipeline = [
        {
            $project: {
                    name: true, 
                    description: true,
                    brand: true,
                    price: true,
                    size: true,
                    unit: true,
                    unitPrice: { $divide: ['$price', '$size']}
                }
        },
        { $sort: {unitPrice: 1} }
    ];
    return this.aggregate(pipeline);
}



module.exports = mongoose.model('Store', storeSchema);