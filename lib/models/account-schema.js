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

const Account = mongoose.model('Account', schema);
module.exports = Account;