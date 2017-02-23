const express = require('express');
const app = express();
const lists = require('./routes/lists-route');
const items = require('./routes/items-route');
const auth = require('./routes/auth');
const ensureAuth = require('./auth/ensure-auth')();
const errorHandler = require('./error-handler')(); // function within a function gets parameters
const ensureRole = require('./auth/ensure-role');
const accounts = require('./routes/account-route');

// logging:
const morgan = require('morgan');
app.use(morgan('dev'));


// const path = require('path');
// const publicPath = path.join(__dirname, '../public');
// app.use(express.static(publicPath));

app.use('/', auth);
app.use('/lists', ensureAuth, ensureRole, lists);
app.use('/items', ensureAuth, ensureRole, items);
app.use('/accounts', accounts);



// this is the last option in route lists
app.use(errorHandler);

module.exports = app;