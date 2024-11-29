const { body, param } = require('express-validator');

const profileValidation = [
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('profession').notEmpty(),
    body('balance').isNumeric(),
    body('type').isIn(['client', 'contractor'])
];

module.exports = { profileValidation };
