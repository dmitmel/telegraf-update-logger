/* eslint-disable camelcase */

const chalk = require('chalk');
const isFunction = require('is-function');
const getMessageType = require('./getMessageType');

const updateLogger = options => ({ update }, next) => {
  if (!isFunction(options.filter) || options.filter(update)) {
    const log = isFunction(options.log) ? options.log : console.log;
    log(format(update, options));
  }

  return next();
};

function format(update, options) {
  const msg = update.message || update.edited_message;

  let str = `(${chalk.blue(msg.message_id)})`;

  str += ` ${formatUser(msg.from)}`;

  const chat = msg.data ? msg.message.chat : msg.chat;
  if (chat.title) str += ` in ${chalk.green(chat.title)}`;

  const forward = msg.forward_from;
  if (forward) str += ` (fwd from ${formatUser(forward)})`;

  const reply = msg.reply_to_message;
  if (reply) str += ` (re to ${chalk.blue(reply.message_id)})`;

  if (msg.edit_date) str += ' (edit)';

  if (msg.data) {
    str += ': action';
  } else if (msg.text) {
    str += ` > ${msg.text}`;
  } else if (msg.new_chat_members) {
    str += `: added ${msg.new_chat_members.map(formatUser).join(', ')}`;
  } else if (msg.left_chat_member) {
    str += `: removed ${formatUser(msg.left_chat_member)}`;
  } else {
    const type = getMessageType(msg);
    str += `: ${type || 'message'}`;
  }

  return str;
}

function formatUser({ first_name, last_name }) {
  let name = first_name;
  if (last_name) name += ` ${last_name}`;
  return chalk.yellow(name);
}

module.exports = Object.assign(updateLogger, { format });
