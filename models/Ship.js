const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Fleet = require('./Fleet'); // Import the Fleet model

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
        fleetId: {
            type: DataTypes.INTEGER,
            allowNull: false, // A ship can exist without being assigned to a fleet
            references: {
                model: 'Fleets', // Name of the related model in the database
                key: 'id', // Key in the Fleet model
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL', // When a fleet is deleted, the fleetId will be set to NULL
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

// Define the relationship
Ship.belongsTo(Fleet, { foreignKey: 'fleetId' });

module.exports = Ship;
