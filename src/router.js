const fs = require('fs');
const path = require('path');

class Router {
    constructor() {
        this.routes = {
            '/': this.loadView('index.html'),
            '/manual': this.loadView('manual.html'),
            '/404': this.loadView('404.html'),
        };
    }

    loadView(viewName) {
        return (res) => {
            fs.readFile(
                path.join(__dirname, 'views', viewName),
                (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            );
        };
    }

    handleRequest(req, res) {
        const handler = this.routes[req.url] || this.routes['/404'];
        handler(res);
    }
}

module.exports = Router;
