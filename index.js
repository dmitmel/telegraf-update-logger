/* eslint-disable camelcase */

const chalk = require('chalk');
const getMessageType = require('./getMessageType');

const updateLogger = options => ({ update }, next) => {
  options = options != null ? options : {};

  if (options.filter == null || options.filter(update)) {
    const log = options.log != null ? options.log : console.log;
    log(format(update, options));
  }

  return next();
};

function format(update, options) {
  options = options != null ? options : {};

  const msg = update.message || update.edited_message;
  const setColor = (color, str) => (options.colors ? chalk[color](str) : str);

  // message ID
  let str = `(${setColor('blue', msg.message_id)})`;

  // user
  const formatUser = ({ first_name, last_name }) => {
    let name = first_name;
    if (last_name) name += ` ${last_name}`;
    return setColor('yellow', name);
  };

  str += ` ${formatUser(msg.from)}`;

  // chat
  const chat = msg.data ? msg.message.chat : msg.chat;
  if (chat.title) str += ` in ${setColor('green', chat.title)}`;

  // forward
  const forward = msg.forward_from;
  if (forward) str += ` (fwd from ${formatUser(forward)})`;

  // reply
  const reply = msg.reply_to_message;
  if (reply) str += ` (re to ${setColor('blue', reply.message_id)})`;

  // edit
  if (msg.edit_date) str += ' (edit)';

  // content
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

module.exports = Object.assign(updateLogger, { format });
