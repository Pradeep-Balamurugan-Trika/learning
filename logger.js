//WINSTON LOGGER//

const winston = require("winston");
require("winston-mongodb");

const mongoTransport = new winston.transports.MongoDB({
  db: 'mongodb://localhost:27017/logs',
  collection: 'logs',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  storeHost: true,
  capped: true,
  cappedSize: 1000000,
  cappedMax: 1000,
  tryReconnect: true,
  options: { useUnifiedTopology: true },
  metaKey: 'metadata',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    mongoTransport,
  ],
});

module.exports = logger;


// const logger = winston.createLogger({
//   level: "debug",
//   format: winston.format.json(),
//   transports: [new winston.transports.Console()],
// });
