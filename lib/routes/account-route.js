const router = require('express').Router();
//const bodyParser = require('body-parser').json();
const Account = require('../models/account-schema');

router
    .get('/', (req, res, next) => {
        Account.find()
            .lean()
            .populate('members.user', 'lists')
            .then(accounts => {
                res.send(accounts);
            })
            .catch(next);
    });