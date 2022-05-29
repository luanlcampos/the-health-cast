const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use('/', require('./routes'));

// Not found routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
}
);


// Error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message,
        error: process.env.NODE_ENV === 'production' ? {} : error.stack
    });
}
);

module.exports = app;