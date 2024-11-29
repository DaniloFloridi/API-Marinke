const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deposit = sequelize.define('Deposit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    operationDate: {
        type: DataTypes.DATE,
        field: 'operationdate'
    },
    depositValue: {
        type: DataTypes.DOUBLE,
        field: 'depositvalue'
    }
});

module.exports = Deposit;
