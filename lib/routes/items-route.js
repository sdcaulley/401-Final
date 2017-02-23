const router = require('express').Router();
const bodyParser = require('body-parser').json();

const Item = require('../models/item-schema');
const Store = require('../models/store-schema');



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
            if (!item) {
                res.status(404).send({ error: `Id ${req.params.id} Not Found` });
            } else {
                res.send(item);
            }
        })
        .catch(next);
})

.post('/', bodyParser, (req, res, next) => {
    Store.findOne({ name: req.body.store })
        .then(store => {
            if (!store) {
                res.status(404).send({ error: `You have not yet registered the store ${req.body.store} with your account. You will need to add this store to your user account before proceeding.` })
            } else {
                delete req.body.store;
                req.body.stores = [];
                req.body.stores.push(store._id);
                new Item(req.body).save()
                    .then(item => res.send(item));
            }
        })
        .catch(next);
})

.delete('/:id', bodyParser, (req, res, next) => {
    Item.findByIdAndRemove(req.params.id)
        .then(deleted => res.send({ deleted: !!deleted }))
        .catch(next);
});


module.exports = router;