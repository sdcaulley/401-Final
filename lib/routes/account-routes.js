const router = require('express').Router();
const bodyParser = require('body-parser').json();
const Account = require('../models/account-schema');
const ensureRole = require('../auth/ensure-role');

router
    .post('/', bodyParser, ensureRole('owner'), (req, res, next) => {
        new Account(req.body).save()
            .then(accounts => res.send(accounts))
            .catch(next);
    })
    .post('/:id/addmember', bodyParser, ensureRole('owner'), (req, res, next) => {
        return Account.findById(req.params.id)
            .then(account => {
                account.members.push(req.body);
                return account.save();
            })
            .then(list => res.send(list))
            .catch(next);
    })
    .post('/:id/addnewlist', bodyParser, ensureRole('owner'), (req, res, next) => {
        return Account.findById(req.params.id)
            .then(account => {
                account.list.push(req.body.list_id);
                return account.save();
            })
            .then(list => res.send(list))
            .catch(next);
    })
    .post('/:id/removemember', bodyParser, ensureRole('owner'), (req, res, next) => {
        return Account.findById(req.params.id)
            .then(account => {
                const newAccount = account.members.filter(x => {
                    if (x.user != req.body.userId) {
                        return x;
                    } else {
                        return null;
                    }
                });
                account.members = newAccount;
                return account.save();
            })
            .then(account => res.send(account))
            .catch(next);
    })
    .post('/:id/removelist', bodyParser, ensureRole('owner'), (req, res, next) => {
        return Account.findById(req.params.id)
            .then(account => {
                const newAccount = account.list.filter(x => {
                    if (x != req.body.list_id) {
                        return x;
                    } else {
                        return null;
                    }
                });
                account.list = newAccount;
                return account.save();
            })
            .then(account => res.send(account))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Account.find()
            .lean()
            .populate('list', 'members.user')
            .then(accounts => res.send(accounts))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Account.findById(req.params.id)
            .lean()
            .populate('list', 'members.user')
            .then(account => {
                if (!account) {
                    res.status(404).send({ error: 'Account not found' });
                } else {
                    res.set('Role', account.members.role)
                        .send(account);
                }
            })
            .catch(next);
    })
    .delete('/:id', ensureRole('owner'), (req, res, next) => {
        Account.findByIdAndRemove(req.params.id)
            .then(deleted => res.send({ deleted: !!deleted }))
            .catch(next);
    });

module.exports = router;