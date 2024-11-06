'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ShipModels'); // Make sure the table name is correct
    },

    down: async (queryInterface, Sequelize) => {
        // You can recreate the old table here if needed, but usually, you just want to keep it simple.
    },
};
