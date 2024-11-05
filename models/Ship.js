const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Ship extends Model {}

Ship.init(
    {
        codeId: {
            type: DataTypes.STRING(6),
            allowNull: false,
            unique: true,
            validate: {
                is: /^[0-9]{6}$/, // Validate that it's a 6-digit number
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maxSpeed: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM(
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
            type: DataTypes.STRING,
            allowNull: true,
        },
        frontalShield: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        lateralLeftShield: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        lateralRightShield: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        backShield: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        shieldType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Ship',
        hooks: {
            beforeSave: (ship) => {
                const totalShields =
                    ship.frontalShield +
                    ship.lateralLeftShield +
                    ship.lateralRightShield +
                    ship.backShield;
                if (totalShields > 100) {
                    throw new Error('Total shield strength cannot exceed 100.');
                }
            },
        },
    }
);

module.exports = Ship;
