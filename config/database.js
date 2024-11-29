const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: console.log,
    define: {
        freezeTableName: true
    }
});

const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        
        // Changed from force: true to alter: true to preserve data
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

initDatabase();

module.exports = sequelize;