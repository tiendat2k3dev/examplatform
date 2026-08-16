const jsonServer = require("json-server");
const path = require("path");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({
  static: "./public",
});

server.use(cors());
server.use(middlewares);
server.use(
  jsonServer.bodyParser({
    limit: "50mb",
  }),
);

server.use(router);

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});