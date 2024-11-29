const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contract = sequelize.define('Contract', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    terms: {
        type: DataTypes.STRING(45)
    },
    operationDate: {
        type: DataTypes.DATE,
        field: 'operationdate'
    },
    status: {
        type: DataTypes.STRING(11),
        validate: {
            isIn: [['new', 'active', 'terminated']]
        }
    }
});

module.exports = Contract;
