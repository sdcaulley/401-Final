const router = require('express').Router();
const bodyParser = require('body-parser').json();

const Item = require('../models/item-schema');

router
    .get('/', (req, res, next) => {
        Item.find()
            .lean()
            .populate('name', 'attributes', 'purchased', 'stores')
            .then(items => res.send(items))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Item.findById(req.params.id)
            .lean()
            .populate('name', 'attributes', 'purchased', 'stores')
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

    .post('/', bodyParser, (req, res, next) => {
        new Item(req.body).save()
            .then(item => res.send(item))
            .catch(next);
    })

    .delete('/:id', bodyParser, (req, res, next) => {
        Item.findByIdAndRemove(req.params.id)
            .then(deleted => res.send({ deleted: !!deleted}))
            .catch(next);
    });


module.exports = router;