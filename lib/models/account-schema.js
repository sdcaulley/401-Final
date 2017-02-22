const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    accType: {
        type: String,
        required: true
    },
    members: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Account', schema);