'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Ships', 'fleetId', {
            type: Sequelize.INTEGER,
            allowNull: true, // Set to true if a ship can exist without a fleet
            references: {
                model: 'Fleets', // This should match the name of the fleets table
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL', // or 'CASCADE', depending on your design
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Ships', 'fleetId');
    },
};
