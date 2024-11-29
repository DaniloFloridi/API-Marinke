const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define('Profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING(45),
        field: 'firstname',
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lastName: {
        type: DataTypes.STRING(45),
        field: 'lastname',
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    profession: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    balance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    type: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            isIn: [['client', 'contractor']]
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Profiles'
});

module.exports = Profile;