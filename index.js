const middleware = require('./lib/middleware');
const format = require('./lib/format');

module.exports = Object.assign(middleware, { format });
