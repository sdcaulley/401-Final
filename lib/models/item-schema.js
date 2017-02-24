const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    attributes: [{ type: String }],
    stores: [{
        type: Schema.Types.ObjectId,
        ref: 'Store'
    }]
});

//method for best price

module.exports = mongoose.model('Item', itemSchema);