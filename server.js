const net = require("net");
const modbus = require("jsmodbus");
const netServer = new net.Server();
const server = new modbus.server.TCP(netServer, {});

server.on("connection", (client) => {
  console.log("New Connection");
});

server.on("postWriteMultipleRegisters", (value) => {
  console.log("Write multiple reisters: ", value._body);
});

let i = 0;

setInterval(() => {
  i++;
  server.holding.writeUInt16BE(i, 8);
  server.holding.writeUInt16BE(i % 3, 10);
  if (i >= 200) {
    i = 0;
  }
}, 1000);

netServer.listen(502);
