const express = require('express');
const app = express();
const lists = require('./routes/lists-route');
const items = require('./routes/items-route');

// logging:
const morgan = require('morgan');
app.use(morgan('dev'));

app.use('/lists', lists);

const path = require('path');
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.use('/lists', lists);
app.use('/items', items);

module.exports = app;