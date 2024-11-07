const ShipModel = require('../models/ShipModel');

class ShipModelManager {
    async createShipModel(args) {
        try {
            const name = args[0];
            const type = args[1]; // Ensure type is one of the predefined options
            const capacity = Number(args[2]);
            const maxSpeed = Number(args[3]);

            // Parse shield values explicitly from args
            const frontalShield = Number(args[4]);
            const lateralLeftShield = Number(args[5]);
            const lateralRightShield = Number(args[6]);
            const backShield = Number(args[7]);

            // Combine all arguments from the 9th onward as the weapon system list
            const weaponSystems = args.slice(8).join(' ').replace(/['"]+/g, ''); // Remove quotes and join

            // Validate shields and types
            if (
                isNaN(frontalShield) ||
                isNaN(lateralLeftShield) ||
                isNaN(lateralRightShield) ||
                isNaN(backShield)
            ) {
                throw new Error(
                    'One or more shield values are not valid numbers.'
                );
            }

            const totalShield =
                frontalShield +
                lateralLeftShield +
                lateralRightShield +
                backShield;
            if (totalShield !== 100) {
                throw new Error(
                    `Total shield must be 100%. You have ${totalShield}%.`
                );
            }

            // Validate ship type
            if (
                ![
                    'warship',
                    'speeder',
                    'crusader',
                    'jumper',
                    'transporter',
                    'patrol',
                ].includes(type)
            ) {
                throw new Error('Invalid ship type.');
            }

            // Create the ship model
            const newModel = await ShipModel.create({
                name,
                type,
                capacity,
                maxSpeed,
                frontalShield,
                lateralLeftShield,
                lateralRightShield,
                backShield,
                shieldType: args[8], // Assuming this comes before weapon systems
                weaponSystems,
            });

            const response =
                'Ship model created: ' + JSON.stringify(newModel, null, 2);

            return response;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Ship model with that name already exists.');
            }
            throw new Error(error.message);
        }
    }

    async updateShipModel(args) {
        const [name, column, value] = args;
        try {
            const shipModel = await ShipModel.findOne({ where: { name } });
            if (!shipModel)
                throw new Error(`Ship model with name ${name} not found.`);

            // Validate the column to prevent invalid updates
            const validColumns = [
                'name',
                'capacity',
                'maxSpeed',
                'type',
                'shieldType',
                'weaponSystems',
            ];

            const shieldColumns = [
                'frontalShield',
                'lateralLeftShield',
                'lateralRightShield',
                'backShield',
            ];

            if (
                !validColumns.includes(column) &&
                !shieldColumns.includes(column)
            ) {
                throw new Error(
                    `Invalid column: ${column}. Allowed columns are: ${validColumns.join(
                        ', '
                    )}`
                );
            }

            // Convert values to numbers where necessary
            let parsedValue = value;
            if (
                shieldColumns.includes(column) ||
                ['capacity', 'maxSpeed'].includes(column)
            ) {
                parsedValue = Number(value);
                if (isNaN(parsedValue)) {
                    throw new Error(
                        `Invalid value for ${column}. It must be a number.`
                    );
                }
                if (
                    shieldColumns.includes(column) &&
                    (parsedValue < 0 || parsedValue > 100)
                ) {
                    throw new Error(
                        'Invalid shield value. Shield values must be between 0 and 100.'
                    );
                }
            }

            // Update the ship model
            await shipModel.update({ [column]: parsedValue });
            return `Ship model ${name} updated: ${column} set to ${parsedValue}.`;
        } catch (error) {
            console.error(`Error updating ship model ${name}:`, error);
            throw new Error('Failed to update ship model.');
        }
    }

    async listShipModels() {
        try {
            const ShipModelsList = await ShipModel.findAll();
            if (!ShipModelsList.length) return 'No ship models found.';
            const response =
                'Ship models:\n' +
                ShipModelsList.map((model) => model.name).join('\n');
            return response;
        } catch (error) {
            console.error('Error listing ship models:', error);
            throw new Error('Failed to list ship models.');
        }
    }

    async deleteModel(name) {
        try {
            const shipModel = await ShipModel.findOne({ where: { name } });
            if (!shipModel)
                throw new Error(`Ship model with name ${name} not found.`);
            await shipModel.destroy();
            return `Ship model ${name} deleted.`;
        } catch (error) {
            console.error(`Error deleting ship model ${name}:`, error);
            throw new Error('Failed to delete ship model.');
        }
    }
}

module.exports = ShipModelManager;
