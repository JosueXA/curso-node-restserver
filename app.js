// Others Packages
require('dotenv').config();
// My Resources
const Server = require('./models/server');


const server = new Server();

server.listen();


