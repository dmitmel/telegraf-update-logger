/* eslint-disable camelcase */

const chalk = require('chalk');
const getMessageType = require('./getMessageType');

const DEFAULT_COLORS = {
  id: chalk.blue,
  chat: chalk.green,
  user: chalk.yellow,
  type: chalk.cyan,
};

const noColor = (str) => str;
const DISABLED_COLORS = {
  id: noColor,
  chat: noColor,
  user: noColor,
  type: noColor,
};

function format(update, options) {
  options = options != null ? options : {};

  const colors =
    typeof options.colors === 'object'
      ? options.colors
      : options.colors === true
      ? DEFAULT_COLORS
      : DISABLED_COLORS;

  const message =
    update.message ||
    update.edited_message ||
    update.channel_post ||
    update.edited_channel_post;
  const callbackQuery = update.callback_query;
  const inlineQuery = update.inline_query;
  const chosenInlineResult = update.chosen_inline_result;
  const shippingQuery = update.shipping_query;
  const preCheckoutQuery = update.pre_checkout_query;
  const { poll } = update;
  const pollAnswer = update.poll_answer;

  function formatMessageID({ message_id }) {
    return colors.id(message_id);
  }

  function formatChat({ title }) {
    return title ? colors.chat(title) : null;
  }

  function formatUser({ first_name, last_name }) {
    let name = first_name;
    if (last_name) name += ` ${last_name}`;
    return colors.user(name);
  }

  function formatSender({ from, author_signature }) {
    if (from) return formatUser(from);
    if (author_signature) return colors.user(author_signature);
    return null;
  }

  function formatForward({
    forward_from,
    forward_from_chat,
    forward_sender_name,
  }) {
    if (forward_from) return `fwd[${formatUser(forward_from)}]`;
    if (forward_from_chat) return `fwd[${formatChat(forward_from_chat)}]`;
    if (forward_sender_name) return `fwd[${colors.user(forward_sender_name)}]`;
    return null;
  }

  function formatReply({ reply_to_message }) {
    return reply_to_message ? `re[${formatMessageID(reply_to_message)}]` : null;
  }

  function formatEdit({ edit_date }) {
    return edit_date ? '(edited)' : null;
  }

  function formatMessageContent({
    text,
    sticker,
    dice,
    poll,
    contact,
    location,
    game,
    pinned_message,
    new_chat_members,
    left_chat_member,
    new_chat_title,
    new_chat_photo,
  }) {
    let str = '';

    if (text) {
      str += text;
    } else if (sticker) {
      const { emoji } = sticker;
      str += emoji ? `${emoji}   ${colors.type('sticker')}` : 'sticker';
    } else if (dice) {
      const { emoji, value } = dice;
      str += `${colors.type('dice')} ${emoji} with value ${value}`;
    } else if (poll) {
      const { type, is_anonymous } = poll;
      const pollAnonymity = is_anonymous ? 'anonymous' : '';
      const pollType =
        type === 'quiz' ? 'quiz' : type === 'regular' ? 'regular poll' : 'poll';
      str += `${colors.type(`${pollAnonymity} ${pollType}`)}`;
    } else if (contact) {
      str += `${colors.type('contact')} of ${formatUser(contact)}`;
    } else if (location) {
      const { latitude, longitude } = location;
      str += `${colors.type('location')} on ${latitude} ${longitude}`;
    } else if (game) {
      str += `${colors.type('game')} ${game.title}`;
    } else if (pinned_message) {
      str += `${colors.type('pinned message')} #${pinned_message.message_id}`;
    } else if (new_chat_members) {
      str += `added ${new_chat_members.map(formatUser).join(', ')}`;
    } else if (left_chat_member) {
      str += `removed ${formatUser(left_chat_member)}`;
    } else if (new_chat_title) {
      str += `changed chat title`;
    } else if (new_chat_photo) {
      str += `changed chat photo`;
    } else {
      const msgType = getMessageType(message);
      str += colors.type(msgType || 'message');
    }

    const { caption } = message;
    if (caption) str += `, ${caption}`;

    return str;
  }

  if (message) {
    let str = `[${formatMessageID(message)}]`;
    const chat = formatChat(message.chat);
    if (chat) str += ` ${chat}:`;
    const sender = formatSender(message);
    if (sender) str += ` ${sender}`;
    const forward = formatForward(message);
    if (forward) str += ` ${forward}`;
    const reply = formatReply(message);
    if (reply) str += ` ${reply}`;
    const edit = formatEdit(message);
    if (edit) str += ` ${edit}`;
    str += `: ${formatMessageContent(message)}`;
    return str;
  }

  if (callbackQuery) {
    const { id, message, from, data } = callbackQuery;
    let str = `[${colors.type('(callback query)')} ${colors.id(id)}]`;
    if (message) {
      str = `[${formatMessageID(message)}]`;
      const chat = formatChat(message.chat);
      if (chat) str += ` ${chat}:`;
    }
    str += ` ${formatUser(from)}`;
    if (data) str += `: ${colors.type('action')}: ${data}`;
    return str;
  }

  if (inlineQuery) {
    const { id, from, query } = inlineQuery;
    let str = `[${colors.type('(inline query)')} ${colors.id(id)}]`;
    str += ` ${formatUser(from)}`;
    str += `: ${query}`;
    return str;
  }

  if (chosenInlineResult) {
    const { result_id, from, query } = chosenInlineResult;
    let str = colors.type('chosen inline result:');
    str += ` ${formatUser(from)}`;
    str += ` chose ${colors.id(result_id)}`;
    if (query) str += ` via query: ${query}`;
    return str;
  }

  if (shippingQuery) {
    const { id, from } = shippingQuery;
    let str = `[${colors.type('(shipping query)')} ${colors.id(id)}]`;
    str += ` from ${formatUser(from)}`;
    return str;
  }

  if (preCheckoutQuery) {
    const { id, from } = preCheckoutQuery;
    let str = `[${colors.type('(pre-checkout query)')} ${colors.id(id)}]`;
    str += ` from ${formatUser(from)}`;
    return str;
  }

  if (poll) {
    const { id, total_voter_count } = poll;
    let str = `[${colors.type('(poll)')} ${colors.id(id)}]`;
    str += ` total voters: ${total_voter_count}`;
    return str;
  }

  if (pollAnswer) {
    const { poll_id, user, option_ids } = pollAnswer;
    let str = `[${colors.type('(poll answer)')} to ${colors.id(poll_id)}]`;
    str += ` ${formatUser(user)}:`;
    if (option_ids.length) {
      str += ` voted [${option_ids}]`;
    } else {
      str += ' retracted their vote';
    }
    return str;
  }

  return 'unsupported update type';
}

module.exports = format;
