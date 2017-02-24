const router = require('express').Router();
const bodyParser = require('body-parser').json();
const ensureRole = require('../auth/ensure-role');

const Store = require('../models/store-schema');

router
    .get('/', (req, res, next) => {
        Store.find()
            .then(stores => {
                return Store.sortPrice();
            })
            .then(stores => res.send(stores))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Store.findById(req.params.id)
            .then(store => {
                if (!store) {
                    res.status(404).send({ error: `Id ${req.params.id} Not Found` });
                } else {
                    res.send(store);
                }
            })
            .catch(next);
    })
    .post('/', ensureRole('owner'), bodyParser, (req, res, next) => {
        new Store(req.body).save()
            .then(store => res.send(store))
            .catch(next);
    })
    .put('/:id', ensureRole('owner'), bodyParser, (req, res, next) => {
        Store.find(req.params.id)
            .then(store => {
                return Store.findByIdAndUpdate(
                    req.params.id,
                    store, { new: true, runValidators: true }
                );
            })
            .then(store => {
                res.send(store);
            });
    })
    .delete('/:id', ensureRole('owner'), bodyParser, (req, res, next) => {
        Store.findByIdAndRemove(req.params.id)
            .then(deleted => res.send({ deleted: !!deleted }))
            .catch(next);
    });

module.exports = router;