const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // Name of the SQLite file
});

module.exports = sequelize;
