const router = require('express').Router();
const bodyParser = require('body-parser').json();

const Store = require('../models/store-schema');

router
    .get('/', (req, res, next) => {
        Store.find()
            .then(stores => res.send(stores))
            .catch(next);
    })
    // .get('/:id', (req, res, next) => {

    // })
    .post('/', bodyParser, (req, res, next) => {
        new Store(req.body).save()
        .then(store => res.send(store))
        .catch(next);
    })
    // .put('/', (req, res, next) => {

    // })
    // .delete('/', (req, res, next) => {

    // })

module.exports = router;