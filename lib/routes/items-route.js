const router = require('express').Router();
// const parseBody = require('parse-body');

const Item = require('../models/item-schema');

router

    .get('/', (req, res, next) => {
        Item.find()
            .lean()
            .populate('name', 'attributes', 'purchased', 'stores')
            .then(items => res.send(items))
            .catch(next);
    });

module.exports = router;

