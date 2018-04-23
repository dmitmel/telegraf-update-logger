/* eslint-disable camelcase */

const chalk = require('chalk').default;
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

  const msg =
    update.message ||
    update.edited_message ||
    update.channel_post ||
    update.edited_channel_post;

  const setColor = (color, str) => (options.colors ? chalk[color](str) : str);

  // message ID
  let str = `[${setColor('blue', msg.message_id)}]`;

  // chat
  const { chat } = msg;
  if (chat.title) str += ` ${setColor('green', chat.title)}`;

  // user
  const formatUser = ({ first_name, last_name }) => {
    let name = first_name;
    if (last_name) name += ` ${last_name}`;
    return setColor('yellow', name);
  };

  // from
  const { from, author_signature } = msg;
  if (from) str += `: ${formatUser(from)}`;
  else if (author_signature) str += `: ${setColor('yellow', author_signature)}`;

  if (msg.new_chat_members) {
    str += ` added ${msg.new_chat_members.map(formatUser).join(', ')}`;
  } else if (msg.left_chat_member) {
    str += ` removed ${formatUser(msg.left_chat_member)}`;
  } else {
    // forward
    const { forward_from, forward_from_chat } = msg;
    if (forward_from) str += ` fwd[${formatUser(forward_from)}]`;
    else if (forward_from_chat)
      str += ` fwd[${setColor('green', forward_from_chat.title)}]`;

    // reply
    const reply = msg.reply_to_message;
    if (reply) str += ` re[${setColor('blue', reply.message_id)}]`;

    // edit
    if (msg.edit_date) str += ' (edited)';

    // content
    str += `: `;

    const { text, sticker, contact } = msg;
    if (text) {
      str += text;
    } else if (sticker) {
      const { emoji } = sticker;
      str += emoji ? `${emoji}   sticker` : 'sticker';
    } else if (contact) {
      str += `${setColor('cyan', 'contact')} of ${formatUser(contact)}`;
    } else {
      const msgType = getMessageType(msg);
      str += setColor('cyan', msgType || 'message');
    }

    const { caption } = msg;
    if (caption) str += `, ${caption}`;
  }

  return str;
}

module.exports = Object.assign(updateLogger, { format });
