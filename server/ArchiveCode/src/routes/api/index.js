
// all the routes for the api will be here

const express = require('express');
const router = express.Router();

// sample route to test the api 
router.get('/thread', require('./getThreads'));

module.exports = router;