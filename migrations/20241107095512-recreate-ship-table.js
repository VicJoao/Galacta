'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Drop the existing Ship table
        await queryInterface.dropTable('Ships');

        // Recreate the Ship table with the new structure
        await queryInterface.createTable('Ships', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            codeId: {
                type: Sequelize.STRING(6),
                allowNull: false,
                unique: true,
                validate: {
                    is: /^[0-9]{6}$/, // Validate that it's a 6-digit number
                },
            },
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
            weaponSystems: {
                type: Sequelize.STRING,
                allowNull: true,
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
            fleetId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Fleets', // Name of the related model in the database
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Drop the Ship table
        await queryInterface.dropTable('Ships');
    },
};
