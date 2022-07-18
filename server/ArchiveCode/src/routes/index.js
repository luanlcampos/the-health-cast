const express = require('express');

const { version, name } = require('../../package.json');

const router = express.Router();

// Expose api to v1/. We can later add a authentication middleware that will verify if the user is authenticated or not
router.use('/v1', require('./api'));

// Health check route   
router.get('/health', (req, res) => {
    res.json({
        name,
        version,
        status: 'OK'
    });
}
);

module.exports = router;