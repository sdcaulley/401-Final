const router = require('express').Router();
const parseBody = require('body-parser').json();

const List = require('../models/list-schema.js');


router
    .get('/', (req, res, next) => {
        const query = {};
        if (req.query.type) query.type = req.query.type;

        List.find(query)
            .lean()
            //.populate('item')
            .then(lists => res.send(lists))
            .catch(next);
    })

.get('/:id', (req, res, next) => {
    List.findById(req.params.id)
        .lean()
        //.populate('item')
        .then(list => {
            if (!list) {
                res.status(404).send({ error: `Id ${req.params.id} Not Found` });
            } else {
                res.send(list);
            }
        })
        .catch(next);
})

.post('/', parseBody, (req, res, next) => {
    new List(req.body).save()
        .then(list => res.send(list))
        .catch(next);
})

.post('/:id/item', parseBody, (req, res, next) => {
    return List.findByIdAndUpdate(req.params.id, { item: req.body.item_id })
        .then(list => { res.send(list); })
        .catch(next);
});


module.exports = router;