// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { port, env,mongo } = require('./config/vars');
const logger = require('./config/logger');
require('./api/controllers/socket.controller');
const app = require('./config/express');
const connection=require('./config/mysql')


// listen to requests
app.listen(port, () => {
	logger.info(`server started on port ${port} (${env})`);
});

/**
* Exports express
* @public
*/
module.exports = app;
