import { NODE_ENV } from "../config/env.js";
import { logger, prodLogger, devLogger } from "../utils/logger.js";
import chalk from "chalk";

export const addLogger = (req, res, next) => {
  if (NODE_ENV === "production") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }

  const getColorForStatusCode = (statusCode, message) => {
    if (statusCode >= 500) {
      return chalk.red(message);
    } else if (statusCode >= 400) {
      return chalk.red(message);
    } else if (statusCode >= 300) {
      return chalk.green(message);
    } else if (statusCode >= 200) {
      return chalk.green(message);
    } else {
      return chalk.white(message);
    }
  };

  const logRequest = () => {
    const message = `${req.method} (${res.statusCode}) to ${req.url} - ${new Date().toLocaleDateString()} `;
    const coloredMessage = getColorForStatusCode(res.statusCode, message);
    req.logger.http(coloredMessage);
  };

  res.on("finish", logRequest);

  next();
};
