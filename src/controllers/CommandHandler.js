const ShipManager = require('./ShipManager');
const FleetManager = require('./FleetManager');
const ShipModelManager = require('./ShipModelManager');
const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor() {
        this.shipManager = new ShipManager();
        this.fleetManager = new FleetManager();
        this.shipModelManager = new ShipModelManager();
    }

    async handleCommand(command) {
        command = decodeURIComponent(command);
        const [cmd, ...args] = command.split(' ');
        try {
            switch (cmd) {
                case 'createFleet':
                    if (args.length < 3)
                        return 'Usage: createFleet <name> <general> <maxCapacity>';
                    return await this.fleetManager.createFleet(args);
                case 'createShip':
                    if (args.length < 4)
                        return 'Usage: createShip <name> <type> <fleetId> <modelId>';
                    return await this.shipManager.createShip(args);
                case 'listShips':
                    return await this.shipManager.listShips(args);
                case 'listFleets':
                    const response = await this.fleetManager.listFleets();
                    console.log(response);
                    return response;
                case 'fetch':
                    if (args.length < 2) return 'Usage: fetch <id> <type>';
                    return await this.fetch(args);
                case 'updateShip':
                    if (args.length < 3)
                        return 'Usage: updateShip <id> <attribute> <value>';
                    return await this.shipManager.updateShip(args);
                case 'updateFleet':
                    if (args.length < 3)
                        return 'Usage: updateFleet <id> <attribute> <value>';
                    console.log(args);
                    return await this.fleetManager.updateFleet(args);
                case 'createShipModel':
                    if (args.length < 6)
                        return 'Usage: createShipModel <name> <type> <capacity> <maxSpeed> <frontalShield> <lateralLeftShield> <lateralRightShield> <backShield> <shieldType> [weaponSystems]';
                    return await this.shipModelManager.createShipModel(args);
                case 'updateShipModel':
                    if (args.length < 3)
                        return 'Usage: updateShipModel <id> <attribute> <value>';
                    return await this.shipModelManager.updateShipModel(args);
                case 'createShipFromModel':
                    if (args.length < 3)
                        return 'Usage: createShipFromModel <name> <fleetId> <modelId>';
                    return await this.shipManager.createShipFromModel(args);
                case 'listShipModels':
                    return await this.shipModelManager.listShipModels();
                case 'deleteShip':
                    if (args.length < 1) return 'Usage: deleteShip <id>';
                    return await this.shipManager.deleteShip(args);
                case 'deleteFleet':
                    if (args.length < 1) return 'Usage: deleteFleet <id>';
                    return await this.fleetManager.deleteFleet(args);
                case 'deleteModel':
                    if (args.length < 1) return 'Usage: deleteModel <id>';
                    return await this.shipModelManager.deleteModel(args);
                case 'start':
                    return await this.start();
                case 'help':
                    return await this.help();
                default:
                    return 'Unknown command: ' + cmd;
            }
        } catch (error) {
            return 'Error handling command: ' + error.message;
        }
    }

    async fetch(args) {
        const id = args[0];
        const type = args[1];

        try {
            let data;
            if (type === 'fleet') {
                data = await this.fleetManager.fetchFleet(id);
            } else {
                data = await this.shipManager.fetchShip(id);
            }
            return data;
        } catch (error) {
            return 'Error fetching data: ' + error.message;
        }
    }

    async start() {
        const filePath = path.join(
            __dirname,
            '../public/assets/ascii/galacta_logo.txt'
        );
        const logo = fs.readFileSync(filePath, 'utf8');
        return logo;
    }

    async help() {
        const response = `Available commands:
        createFleet <name> <general> <maxCapacity> "create a fleet"
        listFleets "list all fleets"
        updateFleet <id> <attribute> <value> "update a fleet by id"
        deleteFleet <id> "delete a fleet by id"

        createShipModel <name> <type> <capacity> <maxSpeed> <frontalShield> <lateralLeftShield> <lateralRightShield> <backShield> <shieldType> [weaponSystems] "create a ship model"
        listShipModels "list all ship models"
        updateShipModel <name> <attribute> <value> "update a ship model by name"
        deleteModel <id> "delete a ship model by id"

        createShip <name> <type> <fleetId> <modelId> "create a ship"
        listShips "list all ships"
        fetch <id> <type> "fetch a ship or fleet by id"
        updateShip <id> <attribute> <value> "update a ship by id"
        deleteShip <id> "delete a ship by id"
        start "show the Galacta logo"
        help`;
        return response;
    }
}

module.exports = CommandHandler;
