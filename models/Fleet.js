const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Ship = require('./Ship');

class Fleet extends Model {}

// Initialize the Fleet model
Fleet.init(
    {
        codeId: {
            type: DataTypes.STRING(4),
            allowNull: false,
            unique: true,
            validate: {
                is: {
                    args: /^[0-9]{4}$/, // Validate that it's a 4-digit number
                    msg: 'Code ID must be a 4-digit number.',
                },
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        general: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        maxCapacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Fleet',
    }
);

// Define the association
Fleet.hasMany(Ship, { as: 'ships', foreignKey: 'fleetId' });
Ship.belongsTo(Fleet, { foreignKey: 'fleetId' });

module.exports = Fleet;
