require('../connection');
const childProcess = require('child_process');


function loadData(collection) {
    return `mongoimport --db shopper --collection ${collection} --file data/${collection}.json --jsonArray`;
}

function loadDB() {
    childProcess.exec(loadData('users'), err => {
        if(err) throw err;
        childProcess.exec(loadData('accounts'), err => {
            if(err) throw err;
            childProcess.exec(loadData('stores'), err => {
                if(err) throw err;
                childProcess.exec(loadData('items'), err => {
                    if(err) throw err;
                    childProcess.exec(loadData('lists'));
                });
            });
        });
    });
}

loadDB();