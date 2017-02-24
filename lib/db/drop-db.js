require('../connection');
const mongoose = require('mongoose');


function dropDB() {
    mongoose.connection.dropDatabase();
}

dropDB();
