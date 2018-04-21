const { inspect } = require('util');
const isFunction = require('is-function');

const updateLogger = options => ({ update }, next) => {
  const log = isFunction(options.log) ? options.log : console.log;
  log(format(update, options));

  return next();
};

function format(update, options) {
  return inspect(update, options);
}

module.exports = Object.assign(updateLogger, { format });
