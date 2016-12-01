'use strict';

const mainApp = require('./mainApp');

const port = mainApp.get('port');
const host = mainApp.get('host');
const server = mainApp.listen(port);

server.on('listening', () =>
  mainApp.logger.log(
    'info',
    `Feathers application started on ${host}:${port}`
  )
);
