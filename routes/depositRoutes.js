const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');

router.post('/:profileId/deposits', depositController.createDeposit);

module.exports = router;
