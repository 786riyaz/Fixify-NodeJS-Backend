const fs = require("fs");
const path = require("path");

// Create logs folder if not exists
const logsPath = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath);
}

// Create ONE log file for everything
const logFilePath = path.join(logsPath, "combined.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Custom logger
function log(message) {
  const logLine = `[${new Date().toISOString()}] ${message}\n`;
  console.log(logLine);        // print to console
  logStream.write(logLine);    // write to combined.log
}

module.exports = { log, logStream };
