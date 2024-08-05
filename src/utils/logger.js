import winston from "winston";

const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

// Add colors for the custom levels
const colors = {
  debug: "green",
  http: "magenta",
  info: "blue",
  warn: "yellow",
  error: "red",
  fatal: "grey",
};

winston.addColors(colors);

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      level: "http",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ level, message }) => {
          return `${level}: ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    }),
  ],
});

const devLogger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message }) => {
          return `${level}: ${message}`;
        })
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message }) => {
          return `${level}: ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: "./prodError.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

export { logger, devLogger, prodLogger };
