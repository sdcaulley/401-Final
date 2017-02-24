const router = require('express').Router();
const bodyParser = require('body-parser').json();
const ensureRole = require('../auth/ensure-role');
const Item = require('../models/item-schema');
require('../models/store-schema');


router
    .get('/', (req, res, next) => {
        Item.find()
            .lean()
            .populate('stores')
            .then(items => res.send(items))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Item.findById(req.params.id)
            .lean()
            .populate('stores')
            .then(item => {
                if(!item) {
                    res.status(404).send( {error: `Id ${req.params.id} Not Found`});
                }
                else {
                    res.send(item);
                }
            })
            .catch(next);
    })

    .post('/', ensureRole('owner'), bodyParser, (req, res, next) => {
        new Item(req.body).save()
            .then(item => res.send(item))
            .catch(next);
    })

    .post('/:id', ensureRole('owner'), bodyParser, (req, res, next) => {
        Item.findById(req.params.id)
            .then(item => {
                item.item = req.body.item;
                if (item.attributes.indexOf(req.body.attributes) === -1) {
                    item.attributes.push(req.body.attributes);
                }
                if (item.stores.indexOf(req.body.stores) === -1) {
                    item.stores.push(req.body.stores);
                }
                return item.save();
            })
            .then(item => res.send(item))
            .catch(next);
    })

    .delete('/:id', ensureRole('owner'), bodyParser, (req, res, next) => {
        Item.findByIdAndRemove(req.params.id)
            .then(deleted => res.send({ deleted: !!deleted}))
            .catch(next);
    });


module.exports = router;