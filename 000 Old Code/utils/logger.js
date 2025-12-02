const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");

// Log folder
const logDir = path.join(__dirname, "..", "logs");

// Daily Rotate Transport
const dailyTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,                    // logs folder
  filename: "%DATE%.log",             // 2025-12-01.log
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,                // compress old logs
  maxSize: "10m",                     // rotate every 10 MB
  maxFiles: "14d",                    // keep logs for 14 days
});

// Create Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()             // structured logs
  ),
  transports: [
    new winston.transports.Console(), // console logs
    dailyTransport                    // rotating log file
  ],
});

// Export stream for Morgan
const stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = { logger, stream };
