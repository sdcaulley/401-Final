const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
            //required: true
    },
    item: [{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }]
});

const List = mongoose.model('List', schema);
module.exports = List;