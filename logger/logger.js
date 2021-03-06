const appRoot = require('app-root-path');
const winston = require('winston');
const format = winston.format;

const options = {
    console: {
      level: 'debug',
      handleExceptions: true,
      format: format.combine(format.timestamp(), format.json(), format.prettyPrint()),
    },
    file: {
      level: 'debug',
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 500000, // 500KB
      maxFiles: 2,
      maxFiles: '1d',
      colorize: false,
    },
    gps: {
      level: 'gpsEvent',
      filename: `${appRoot}/logs/gps.log`,
      handleExceptions: true,
      json: true,
      maxsize: 500000, // 500KB
      maxFiles: 2,
      maxFiles: '1d',
      colorize: false,
    }
  };


  const myCustomLevels = {
    levels: { 
      gpsEvent: 0,
      emerg: 1, 
      alert: 2, 
      crit: 3, 
      error: 4, 
      warning: 5, 
      notice: 6, 
      info: 7, 
      debug: 8
    }
  };

  const logger = new winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
      new winston.transports.Console(options.console),
      new winston.transports.File(options.file),
      new winston.transports.File(options.gps)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };

  module.exports = {logger, winston};