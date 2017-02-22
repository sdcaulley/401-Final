const app = require('./lib/app');
const http = require('http');
const PORT = process.env.PORT || 3000;
require('./lib/connection');

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('server running on', server.address());
});
