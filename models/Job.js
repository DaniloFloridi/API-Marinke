const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING(45)
    },
    operationDate: {
        type: DataTypes.DATE,
        field: 'operationdate'
    },
    paymentDate: {
        type: DataTypes.DATE,
        field: 'paymentdate'
    },
    price: {
        type: DataTypes.DOUBLE
    },
    paid: {
        type: DataTypes.BOOLEAN
    },
}, {
    indexes: [
        {
            fields: ['contractId', 'paid']
        }
    ]
});

module.exports = Job;
