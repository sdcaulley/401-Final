const app = require('./lib/app');
const connection = require('./lib/connection');
const http = require('http');

//const DB_URI = process.env.DBURI || 'mongodb://localhost:27017/shopper';


const server = http.createServer(app);

server.listen(3000, () => {
    console.log('server running on', server.address());
});