const CommandHandler = require('./CommandHandler');

class Terminal {
    constructor() {
        this.commandHandler = new CommandHandler();
    }

    async executeCommand(command) {
        const response = await this.commandHandler.handleCommand(command);
        return response;
    }
}

module.exports = Terminal;
