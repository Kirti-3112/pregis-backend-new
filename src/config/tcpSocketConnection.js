const net = require('net');
const logger = require('./logger');

let client;

function connectToServer(serverAddress, serverPort) {
  client = new net.Socket();

  client.connect(serverPort, serverAddress, () => {
    logger.info(
      `Connected to TCP Server Address: ${serverAddress} && Port : ${serverPort}`
    );
  });

  client.on('error', (error) => {
    logger.error(`TCP Socket Connection Error : ${error}`);
  });

  // Handle connection closed
  client.on('close', () => {
    logger.warn('Connection to the server closed');
  });

  return client;
}

module.exports = connectToServer;
