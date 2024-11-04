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
        const [cmd, ...args] = command.split(' ');

        try {
            switch (cmd) {
                case 'createShip':
                    return await this.shipManager.createShip(args); // Return the response
                case 'listShips':
                    return await this.shipManager.listShips(args); // Return the response
                case 'listFleets':
                    return await this.fleetManager.listFleets(); // Return the response
                case 'fetch':
                    return await this.fetch(args); // Return the response
                case 'updateShip':
                    return await this.shipManager.updateShip(args); // Return the response
                case 'updateFleet':
                    return await this.fleetManager.updateFleet(args); // Return the response
                case 'createShipModel':
                    return await this.shipModelManager.createShipModel(args); // Return the response
                case 'updateShipModel':
                    return await this.shipModelManager.updateShipModel(args); // Return the response
                case 'createShipFromModel':
                    return await this.shipManager.createShipFromModel(args); // Return the response
                case 'listShipModels':
                    return await this.shipModelManager.listShipModels(); // Return the response
                case 'deleteShip':
                    return await this.shipManager.deleteShip(args); // Return the response
                case 'deleteFleet':
                    return await this.fleetManager.deleteFleet(args); // Return the response
                case 'deleteModel':
                    return await this.shipModelManager.deleteModel(args); // Return the response
                case 'start':
                    return await this.start(); // Return the logo
                case 'help':
                    return await this.help(); // Return the help response
                default:
                    return 'Unknown command: ' + cmd; // Return unknown command message
            }
        } catch (error) {
            return 'Error handling command: ' + error.message; // Return error message
        }
    }

    async fetch(args) {
        const id = args[0];
        const type = args[1]; // Optional to distinguish between ship or fleet

        try {
            let data;
            if (type === 'fleet') {
                data = await this.fleetManager.fetchFleet(id);
            } else {
                data = await this.shipManager.fetchShip(id);
            }
            return 'Fetched data: ' + JSON.stringify(data); // Return fetched data
        } catch (error) {
            return 'Error fetching data: ' + error.message; // Return error message
        }
    }

    async start() {
        const filePath = path.join(
            __dirname,
            '../public/assets/ascii/galacta_logo.txt'
        );
        const logo = fs.readFileSync(filePath, 'utf8');
        return logo; // Return logo content
    }

    async help() {
        const response = `Available commands:
        createShip <name> <type> <fleetId> <modelId>
        listShips
        listFleets
        fetch <id> <type>
        updateShip <id> <attribute> <value>
        updateFleet <id> <attribute> <value>
        createShipModel <name> <type> <frontalShield> <lateralLeftShield> <lateralRightShield> <backShield> <shieldType>
        updateShipModel <id> <attribute> <value>
        createShipFromModel <name> <fleetId> <modelId>
        listShipModels
        deleteShip <id>
        deleteFleet <id>
        deleteModel <id>
        start
        help`;
        return response; // Return help information
    }
}

module.exports = CommandHandler;
