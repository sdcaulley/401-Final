const router = require('express').Router();
const bodyParser = require('body-parser').json();

const List = require('../models/list-schema.js');


router
    .get('/', (req, res, next) => {
        List.find()
            .lean()
            // .populate('item')   
            .then(lists => res.send(lists))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        List.findById(req.params.id)
            .lean()
            // .populate('item')
            .then(list => {
                if(!list) {
                    res.status(404).send( {error: `Id ${req.params.id} Not Found`});
                }
                else {
                    res.send(list);
                }
            })
            .catch(next);
    })

    .post('/', bodyParser, (req, res, next) => {
        new List(req.body).save()
            .then(list => res.send(list))
            .catch(next);
    })

    .post('/:id/additem', bodyParser, (req, res, next) => {
        List.findByIdAndUpdate(req.params.id, { item: req.body.item_id})
            .then(list => res.send(list))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        List.findByIdAndRemove(req.params.id)
            .then(deleted => res.send({ deleted: !!deleted }))
            .catch(next);
    })

    .delete('/:id/removeitem', bodyParser, (req, res, next) => {
        List.findByIdAndUpdate(req.params.id, { item: req.body.item_id})
            .then(deleted => res.send({ deleted: !!deleted }))
            .catch(next);
    });


module.exports = router;