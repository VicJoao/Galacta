const http = require('http');
const Router = require('./src/router');
const Terminal = require('./src/controllers/terminal');
const sequelize = require('./src/config/database');

// Estabelecer conexão com o banco de dados
sequelize
    .authenticate()
    .then(() => {
        console.log(
            'Connection to the SQLite database has been established successfully.'
        );
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

const router = new Router();
const terminal = new Terminal();
const server = http.createServer(async (req, res) => {
    try {
        console.log(`Request received for ${req.url}`);
        console.log(`Request method is ${req.method}`);

        // Verifica se a URL inicia com /run
        if (req.url.startsWith('/run/')) {
            const command = req.url.split('/run/')[1]; // Obtém o comando da URL
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                // Se você também estiver passando dados no corpo, você pode processá-los aqui
                const terminalResponse = await terminal.executeCommand(command);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ output: terminalResponse }));
            });
            return;
        }

        await router.handleRequest(req, res);
    } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
