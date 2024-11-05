'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Ships', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            codeId: {
                type: Sequelize.STRING(6),
                allowNull: false,
                unique: true,
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
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Ships');
    },
};
