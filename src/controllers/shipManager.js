const Ship = require('../models/Ship');
const ShipModel = require('../models/ShipModel');
const Fleet = require('../models/Fleet');

class ShipManager {
    // Generate a unique 6-digit code ID for ships
    async uniqueCodeIdGenerator() {
        const codeId = Math.floor(100000 + Math.random() * 900000).toString();
        if (await Ship.findOne({ where: { codeId } })) {
            return this.uniqueCodeIdGenerator();
        }
        return codeId;
    }

    // Create a new ship
    // Create a new ship
    async createShip(args) {
        try {
            const [
                name,
                fleetIdStr,
                type,
                capacityStr,
                maxSpeedStr,
                frontalShieldStr,
                lateralLeftShieldStr,
                lateralRightShieldStr,
                backShieldStr,
                shieldType,
                ...weaponArgs
            ] = args;

            if (!name || name.trim().length === 0)
                throw new Error('Ship name cannot be empty.');

            // Parse numeric values
            const capacity = this.parseNumericValue(capacityStr, 'capacity');
            const maxSpeed = this.parseNumericValue(maxSpeedStr, 'maxSpeed');
            const frontalShield = this.parseNumericValue(
                frontalShieldStr,
                'frontalShield'
            );
            const lateralLeftShield = this.parseNumericValue(
                lateralLeftShieldStr,
                'lateralLeftShield'
            );
            const lateralRightShield = this.parseNumericValue(
                lateralRightShieldStr,
                'lateralRightShield'
            );
            const backShield = this.parseNumericValue(
                backShieldStr,
                'backShield'
            );
            const weaponSystems = weaponArgs.join(' ').replace(/['"]+/g, ''); // Clean up quotes

            // Validate shields
            this.validateShields(
                frontalShield,
                lateralLeftShield,
                lateralRightShield,
                backShield
            );

            // Validate ship type
            this.validateShipType(type);

            // Validate fleetId: Ensure that the fleet exists
            const fleetId = Number(fleetIdStr);
            const fleet = await Fleet.findOne({ where: { id: fleetId } }); // Assuming 'id' is the primary key for Fleet
            if (!fleet) {
                throw new Error(`Fleet with ID ${fleetId} not found.`);
            }

            // Create the ship
            const newShip = await Ship.create({
                name,
                fleetId,
                type,
                capacity,
                maxSpeed,
                frontalShield,
                lateralLeftShield,
                lateralRightShield,
                backShield,
                shieldType,
                weaponSystems,
                codeId: await this.uniqueCodeIdGenerator(),
            });

            return `Ship created: ${JSON.stringify(newShip, null, 2)}`;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Ship with that name already exists.');
            }
            throw new Error(`Error creating ship: ${error.message}`);
        }
    }

    // Update a ship by codeId
    async updateShip(args) {
        const [codeId, column, value] = args;
        try {
            const ship = await Ship.findOne({ where: { codeId } });
            if (!ship)
                throw new Error(`Ship with code ID ${codeId} not found.`);

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

            if (![...validColumns, ...shieldColumns].includes(column)) {
                throw new Error(
                    `Invalid column: ${column}. Allowed columns are: ${validColumns.join(
                        ', '
                    )}`
                );
            }

            // Convert values to numbers for specific columns
            let parsedValue = value;
            if (['capacity', 'maxSpeed', ...shieldColumns].includes(column)) {
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

            // Update the ship
            await ship.update({ [column]: parsedValue });
            return `Ship ${codeId} updated: ${column} set to ${parsedValue}.`;
        } catch (error) {
            throw new Error(`Error updating ship ${codeId}: ${error.message}`);
        }
    }

    async createShipFromModel(args) {
        try {
            const [name, fleetCodeIdStr, modelName] = args;

            // Convert fleetCodeIdStr to a number if it's supposed to be numeric
            const fleetCodeId = Number(fleetCodeIdStr);

            // Check if fleet exists using the codeId field
            const fleet = await Fleet.findOne({
                where: { codeId: fleetCodeId },
            });
            if (!fleet)
                throw new Error(`Fleet with codeId ${fleetCodeId} not found.`);

            // Check if model exists
            const model = await ShipModel.findOne({
                where: { name: modelName },
            });
            if (!model) throw new Error(`Model ${modelName} not found.`);

            // Create new ship
            const newShip = await Ship.create({
                name,
                fleetId: fleet.id, // Assuming you're using the fleet's id as foreign key
                capacity: model.capacity,
                maxSpeed: model.maxSpeed,
                type: model.type,
                weaponSystems: model.weaponSystems,
                frontalShield: model.frontalShield,
                lateralLeftShield: model.lateralLeftShield,
                lateralRightShield: model.lateralRightShield,
                backShield: model.backShield,
                shieldType: model.shieldType,
                codeId: await this.uniqueCodeIdGenerator(),
            });

            return `Ship created: ${JSON.stringify(newShip, null, 2)}`;
        } catch (error) {
            throw new Error(`Error creating ship from model: ${error.message}`);
        }
    }

    async listShips() {
        try {
            const ships = await Ship.findAll();
            return JSON.stringify(ships, null, 2);
        } catch (error) {
            throw new Error(`Error listing ships: ${error.message}`);
        }
    }

    // Delete a ship by codeId
    async deleteShip(codeId) {
        try {
            const ship = await Ship.findOne({ where: { codeId } });
            if (!ship)
                throw new Error(`Ship  with code ID ${codeId} not found.`);
            await ship.destroy();
            return `Ship  ${codeId} deleted.`;
        } catch (error) {
            throw new Error(`Error deleting ship ${codeId}: ${error.message}`);
        }
    }
}

module.exports = ShipManager;
