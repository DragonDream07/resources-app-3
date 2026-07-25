'use strict';

const createApp = require('./app');
const config = require('./config/index');
const logger = require('./utils/logger');

const app = createApp();
const port = config.port || 3000;

const server = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

module.exports = server;
