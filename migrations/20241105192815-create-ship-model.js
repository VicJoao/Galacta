'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ShipModels', {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            maxSpeed: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM(
                    'warship',
                    'speeder',
                    'crusader',
                    'jumper',
                    'transporter',
                    'patrol'
                ),
                allowNull: false,
            },
            frontalShield: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100,
                },
            },
            lateralLeftShield: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100,
                },
            },
            lateralRightShield: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100,
                },
            },
            backShield: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100,
                },
            },
            shieldType: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            weaponSystems: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('ShipModels');
    },
};
