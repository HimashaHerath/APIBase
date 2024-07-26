const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, errors } = format;
const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDirectory, "combined.log") }),
    new transports.File({
      filename: path.join(logDirectory, "errors.log"),
      level: "error",
    }),
  ],
});

module.exports = logger;
