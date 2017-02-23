const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    accType: {
        type: String,
        enum: ['individual', 'family', 'organization'],
        required: true
    },
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            enum: ['owner', 'user']
        }
    }],
    lists: [{
        type: Schema.Types.ObjectId,
        ref: 'List'
    }]
});

module.exports = mongoose.model('Account', schema);