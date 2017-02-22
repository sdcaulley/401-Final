const express = require('express');
const app = express();
const lists = require('./routes/lists-route');
const items = require('./routes/items-route');
const auth = require('./routes/auth');
const ensureAuth = require('./auth/ensure-auth')();
const errorHandler = require('./error-handler')(); // function within a function gets parameters

// logging:
const morgan = require('morgan');
app.use(morgan('dev'));

// we need to create a static folder and set path equal to that file path or delete this
//app.use(express.static(path));

app.use('/', auth);
app.use('/lists', ensureAuth, lists);
app.use('/items', ensureAuth, items);

// this is the last option in route lists
app.use(errorHandler);

module.exports = app;