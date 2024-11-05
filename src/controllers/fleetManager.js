const Fleet = require('../models/fleet');
const Ship = require('../models/Ship'); // To include ship associations

class FleetManager {
    async uniqueCodeIdGenerator() {
        const codeId = Math.floor(1000 + Math.random() * 9000).toString();
        if (await Fleet.findOne({ where: { codeId } })) {
            return this.uniqueCodeIdGenerator();
        }
        return codeId;
    }
    async listFleets() {
        try {
            const response = await Fleet.findAll({
                include: ['ships'], // Includes related ships
            });
            return this.formatFleetList(response);
        } catch (error) {
            console.error('Error listing fleets:', error);
            throw new Error('Unable to fetch fleet list.');
        }
    }

    formatFleetList(fleets) {
        const formattedString = fleets.map((fleet) => {
            const ships = fleet.ships.map((ship) => ship.name).join(', ');
            return `${fleet.codeId} - ${fleet.name} - ${fleet.general} - ${fleet.maxCapacity} - Ships: ${ships}`;
        });
        return formattedString.join('\n');
    }

    async updateFleet(args) {
        const [codeId, column, value] = args;
        try {
            const fleet = await Fleet.findOne({ where: { codeId } });
            if (!fleet)
                throw new Error(`Fleet with code ID ${codeId} not found.`);

            // Validate the column to prevent invalid updates
            const validColumns = ['name', 'general', 'maxCapacity']; // Update this list based on your model
            if (!validColumns.includes(column)) {
                throw new Error(
                    `Invalid column: ${column}. Allowed columns are: ${validColumns.join(
                        ', '
                    )}`
                );
            }

            await fleet.update({ [column]: value });
            return `Fleet ${codeId} updated: ${column} set to ${value}.`;
        } catch (error) {
            console.error(`Error updating fleet ${codeId}:`, error);
            throw new Error('Failed to update fleet.');
        }
    }

    async deleteFleet(id) {
        try {
            const fleet = await Fleet.findByPk(id);
            if (!fleet) throw new Error(`Fleet with ID ${id} not found.`);
            await fleet.destroy();
            return { message: `Fleet ${id} deleted.` };
        } catch (error) {
            console.error(`Error deleting fleet ${id}:`, error);
            throw new Error('Failed to delete fleet.');
        }
    }

    async fetchFleet(codeId) {
        try {
            const fleet = await Fleet.findOne({
                where: { codeId }, // Change here to find by codeId
                include: ['ships'], // Includes related ships
            });
            if (!fleet)
                throw new Error(`Fleet with code ID ${codeId} not found.`);
            return this.createFetchFleetResponse(fleet);
        } catch (error) {
            console.error(
                `Error fetching fleet with code ID ${codeId}:`,
                error
            );
            throw new Error('Failed to fetch fleet.');
        }
    }

    createFetchFleetResponse(fleet) {
        const ships =
            fleet.ships.length > 0
                ? fleet.ships.map((ship) => ship.name).join(', ')
                : 'No ships assigned';

        return `
    Fleet Code: ${fleet.codeId}
    Fleet Name: ${fleet.name}
    General: ${fleet.general}
    Max Capacity: ${fleet.maxCapacity}
    Ships: ${ships}`;
    }

    async createFleet(args) {
        console.log(args);
        try {
            const [name, general, maxCapacity] = args;
            // Validate inputs
            if (!name) {
                throw new Error('Name is required.');
            }
            if (!general) {
                throw new Error('General is required.');
            }
            if (!maxCapacity || isNaN(maxCapacity)) {
                throw new Error('Max capacity is required.');
            }

            const codeId = await this.uniqueCodeIdGenerator();
            const newFleet = await Fleet.create({
                codeId,
                name,
                general,
                maxCapacity,
            });
            return `Fleet created: ${newFleet.codeId} - ${newFleet.name} - ${newFleet.general} - ${newFleet.maxCapacity}`;
        } catch (error) {
            console.error('Error creating fleet:', error);
            throw new Error('Failed to create fleet.');
        }
    }
}
module.exports = FleetManager;
