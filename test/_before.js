process.env.MONGODB_URI = 'mongodb://localhost:27017/shopper-test';
require('../lib/connection');
const childProcess = require('child_process');
const mongoose = require('mongoose');


function loadData(collection) {
    return `mongoimport --db shopper-test --collection ${collection} --file data/${collection}.json --jsonArray`;
}

before(done => {
    mongoose.connection.dropDatabase();
    childProcess.exec(loadData('users'), err => {
        if(err) return done(err);
        childProcess.exec(loadData('accounts'), err => {
            if(err) return done(err);
            childProcess.exec(loadData('stores'), err => {
                if(err) return done(err);
                childProcess.exec(loadData('items'), err => {
                    if(err) return done(err);
                    childProcess.exec(loadData('lists'), done);
                });
            });
        });
    });
});