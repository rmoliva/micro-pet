const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

// Set up logger
// Default npm levels
const _customColors = {
  trace: 'white',
  debug: 'green',
  verbose: 'green',
  info: 'blue',
  warn: 'yellow',
  error: 'red',
};

const _logDir = function() {
  return path.join(__dirname, '../', 'logs');
};

const _consoleTransport = function(configuration) {
  return new(winston.transports.Console)({
    level: configuration.level,
    colorize: true,
    timestamp: true,
  });
};

const _fileRotateTransport = function(configuration) {
  return new (winston.transports.DailyRotateFile)({
    level: configuration.level,
    filename: path.join(_logDir(), configuration.file),
    prepend: true,
  });
};

const _transports = function(configuration) {
  return [
    _consoleTransport(configuration),
    _fileRotateTransport(configuration),
  ];
};

// Asegurarse de que exista la carpeta de log
const _ensureLogDir = function() {
  if (!fs.existsSync(_logDir())) {
    fs.mkdirSync(_logDir());
  }
};

module.exports = function() {
  const app = this;
  _ensureLogDir();

  const configuration = app.get('logger');
  const logger = new(winston.Logger)({
    colors: _customColors,
    transports: _transports(configuration),
  });

  winston.addColors(_customColors);

  // Extend logger object to properly log 'Error' types
  const origLog = logger.log;

  logger.log = function(level, msg) {
    const objType = Object.prototype.toString.call(msg);
    if (objType === '[object Error]') {
      origLog.call(logger, level, msg.toString());
    } else {
      origLog.call(logger, level, msg);
    }
  };
  app.logger = logger;
  return logger;
};
