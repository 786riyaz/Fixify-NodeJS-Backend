// utils/logger.js
const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");

const logDir = path.join(__dirname, "..", "logs");

const dailyTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "10m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    dailyTransport,
  ],
});

const stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = { logger, stream };
