const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');

router.get('/', contractController.getAllContracts);
router.get('/:id', contractController.getContractById);
router.post('/', contractController.createContract);
router.get('/:contractId/unpaid-jobs', require('../controllers/jobController').getUnpaidJobs);

module.exports = router;
