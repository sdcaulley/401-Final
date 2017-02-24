const router = require('express').Router();
const bodyParser = require('body-parser').json();
const List = require('../models/list-schema.js');

router
    .get('/', (req, res, next) => {
        List.find()
            .lean()
            .populate('item')
            .then(lists => res.send(lists))
            .catch(next);
    })

.get('/:id', (req, res, next) => {
    List.findById(req.params.id)
        .lean()
        .populate('item')
        .then(list => {
            if (!list) {
                res.status(404).send({ error: `Id ${req.params.id} Not Found` });
            } else {
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
    return List.findById(req.params.id)
        .then(list => {
            console.log('list: ', list);
            list.item.push(req.body._id);
            return list.save();
        })
        .then(list => {
            res.send(list);
        })
        .catch(next);
})

.post('/:id/removeitem', bodyParser, (req, res, next) => {
    return List.findById(req.params.id)
        .then(list => {
            const newList = list.item.filter(x => {
                if (x != req.body.itemID) {
                    return x;
                } else {
                    return null;
                }
            });
            list.item = newList;
            return list.save();
        })
        .then(list => res.send(list))
        .catch(next);
})

.delete('/:id', (req, res, next) => {
    List.findByIdAndRemove(req.params.id)
        .then(deleted => res.send({ deleted: !!deleted }))
        .catch(next);
});

module.exports = router;