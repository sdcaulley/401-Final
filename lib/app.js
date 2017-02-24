const express = require('express');
const app = express();
const lists = require('./routes/lists-route');
const items = require('./routes/items-route');
const stores = require('./routes/store-routes');
const auth = require('./routes/auth');
const accounts = require('./routes/account-routes');
const ensureAuth = require('./auth/ensure-auth')();
const errorHandler = require('./error-handler')(); // function within a function gets parameters

// logging:
const morgan = require('morgan');
app.use(morgan('dev'));

app.use('/', auth);
app.use('/lists', ensureAuth, lists);
app.use('/items', ensureAuth, items);
app.use('/accounts', ensureAuth, accounts);
app.use('/stores', ensureAuth, stores);

// this is the last option in route lists
app.use(errorHandler);

module.exports = app;