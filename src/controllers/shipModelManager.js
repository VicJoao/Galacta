const ShipModel = require('../models/ShipModel');

class ShipModelManager {
    async createShipModel(args) {
        try {
            const {
                name,
                type,
                frontalShield,
                lateralLeftShield,
                lateralRightShield,
                backShield,
                shieldType,
            } = args;
            const totalShield =
                frontalShield +
                lateralLeftShield +
                lateralRightShield +
                backShield;

            if (totalShield > 100)
                throw new Error('Total shield value cannot exceed 100.');

            const newModel = await ShipModel.create({
                name,
                type,
                frontalShield,
                lateralLeftShield,
                lateralRightShield,
                backShield,
                shieldType,
            });

            return newModel;
        } catch (error) {
            console.error('Error creating ship model:', error);
            throw new Error('Failed to create ship model.');
        }
    }

    async updateShipModel(id, updatedData) {
        try {
            const model = await ShipModel.findByPk(id);
            if (!model) throw new Error(`Model with ID ${id} not found.`);
            await model.update(updatedData);
            return model;
        } catch (error) {
            console.error(`Error updating model ${id}:`, error);
            throw new Error('Failed to update model.');
        }
    }

    async listShipModels() {
        try {
            return await ShipModel.findAll();
        } catch (error) {
            console.error('Error listing ship models:', error);
            throw new Error('Failed to list ship models.');
        }
    }

    async deleteModel(id) {
        try {
            const model = await ShipModel.findByPk(id);
            if (!model) throw new Error(`Model with ID ${id} not found.`);
            await model.destroy();
            return { message: `Model ${id} deleted.` };
        } catch (error) {
            console.error(`Error deleting model ${id}:`, error);
            throw new Error('Failed to delete model.');
        }
    }
}

module.exports = ShipModelManager;
