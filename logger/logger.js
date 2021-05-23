const appRoot = require('app-root-path');
const winston = require('winston');
const format = winston.format;

const options = {
    file: {
      level: 'info',
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      format: format.combine(format.timestamp(), format.json(), format.prettyPrint()),
    },
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
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };

  module.exports = {logger, winston};