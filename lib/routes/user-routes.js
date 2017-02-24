const router = require('express').Router();

const User = require('../models/user-schema');

module.exports = router
    .get('/', (req, res, next) => {
        User.find()
            .lean()
            .then(users => res.send(users))
            .catch(next);
    });