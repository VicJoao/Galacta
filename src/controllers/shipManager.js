const Ship = require('../models/Ship');
const Fleet = require('../models/Fleet');
const ShipModel = require('../models/ShipModel');

class ShipManager {
    async createShip(fleetId, args) {
        try {
            const fleet = await Fleet.findByPk(fleetId);
            if (!fleet) throw new Error(`Fleet with ID ${fleetId} not found.`);

            const { name, type } = args;
            const newShip = await Ship.create({ name, type, fleetId });
            return newShip;
        } catch (error) {
            console.error('Error creating ship:', error);
            throw new Error('Failed to create ship.');
        }
    }

    async listShips() {
        try {
            return await Ship.findAll();
        } catch (error) {
            console.error('Error listing ships:', error);
            throw new Error('Failed to list ships.');
        }
    }

    async updateShip(id, updatedData) {
        try {
            const ship = await Ship.findByPk(id);
            if (!ship) throw new Error(`Ship with ID ${id} not found.`);
            await ship.update(updatedData);
            return ship;
        } catch (error) {
            console.error(`Error updating ship ${id}:`, error);
            throw new Error('Failed to update ship.');
        }
    }

    async deleteShip(id) {
        try {
            const ship = await Ship.findByPk(id);
            if (!ship) throw new Error(`Ship with ID ${id} not found.`);
            await ship.destroy();
            return { message: `Ship ${id} deleted.` };
        } catch (error) {
            console.error(`Error deleting ship ${id}:`, error);
            throw new Error('Failed to delete ship.');
        }
    }

    async createShipFromModel(fleetId, modelId) {
        try {
            const model = await ShipModel.findByPk(modelId);
            const fleet = await Fleet.findByPk(fleetId);

            if (!model) throw new Error(`Model with ID ${modelId} not found.`);
            if (!fleet) throw new Error(`Fleet with ID ${fleetId} not found.`);

            const newShip = await Ship.create({
                name: model.name,
                type: model.type,
                shield: model.shield,
                weaponSystem: model.weaponSystem,
                fleetId: fleetId,
            });

            return newShip;
        } catch (error) {
            console.error('Error creating ship from model:', error);
            throw new Error('Failed to create ship from model.');
        }
    }

    async fetchShip(id) {
        try {
            const ship = await Ship.findByPk(id);
            if (!ship) throw new Error(`Ship with ID ${id} not found.`);
            return ship;
        } catch (error) {
            console.error(`Error fetching ship ${id}:`, error);
            throw new Error('Failed to fetch ship.');
        }
    }
}

module.exports = ShipManager;
