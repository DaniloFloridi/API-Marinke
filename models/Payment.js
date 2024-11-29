const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    operationDate: {
        type: DataTypes.DATE,
        field: 'operationdate'
    },
    paymentValue: {
        type: DataTypes.DOUBLE,
        field: 'paymentvalue'
    }
});

module.exports = Payment;
