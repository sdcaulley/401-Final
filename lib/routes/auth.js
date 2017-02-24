const router = require('express').Router();
const bodyParser = require('body-parser').json();
const User = require('../models/user-schema');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth')();


function hasUsernameAndPassword(req, res, next) {
    const user = req.body;
    if (!user.name || !user.password) {
        return next({
            code: 400,
            error: 'username and password must be supplied'
        });
    }
    next();
}

function hasUsernamePasswordEmail(req, res, next) {
    const userEmail = req.body;
    if (!userEmail.name || !userEmail.password || !userEmail.email) {
        return next({
            code: 400,
            error: 'username, password, and email must be supplied for signup'
        });
    }
    next();
}

router
    .get('/verify', ensureAuth, (req, res) => {
        res.send({ valid: true });
    })
    .post('/signup', bodyParser, hasUsernamePasswordEmail, (req, res, next) => {
        const data = req.body;
        delete req.body;

        User.find({ name: data.name }).count()
            .then(count => {
                if (count > 0) throw {
                    code: 400,
                    error: `username ${data.name} already exists`
                };

                return new User(data).save();
            })
            .then(user => token.sign(user))
            .then(token => res.send({ token }))
            .catch(next);
    })
    .post('/signin', bodyParser, hasUsernameAndPassword, (req, res, next) => {
        const data = req.body;
        delete req.body;

        User.findOne({ name: data.name })
            .then(user => {
                if (!user || !user.comparePassword(data.password)) {
                    throw {
                        code: 400,
                        error: 'invalid username or password'
                    };
                }

                return user;
            })
            .then(user => token.sign(user))
            .then(token => res.send({ token }))
            .catch(next);
    });

module.exports = router;