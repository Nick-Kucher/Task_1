const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors({
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE,OPTIONS', 
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', 
}));

server.use(middlewares);
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
