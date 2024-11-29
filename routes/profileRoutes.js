const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/', profileController.getAllProfiles);
router.get('/:id', profileController.getProfileById);
router.post('/', profileController.createProfile);

module.exports = router;
