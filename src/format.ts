/* eslint-disable camelcase */

import * as chalk from 'chalk';
import * as tg from 'typegram';
import * as getMessageType from './getMessageType';

namespace format {
  export interface Options {
    colors?: OptionsColors | boolean | null;
  }

  export interface OptionsColors {
    id: (str: string) => string;
    chat: (str: string) => string;
    user: (str: string) => string;
    type: (str: string) => string;
  }
}

const DEFAULT_COLORS: format.OptionsColors = {
  id: chalk.blue,
  chat: chalk.green,
  user: chalk.yellow,
  type: chalk.cyan,
};

const noColor = (str: string): string => str;
const DISABLED_COLORS: format.OptionsColors = {
  id: noColor,
  chat: noColor,
  user: noColor,
  type: noColor,
};

function format(update: tg.Update, options?: format.Options | null): string {
  options ??= {};

  const colors =
    options.colors != null && typeof options.colors === 'object'
      ? options.colors
      : options.colors === true
      ? DEFAULT_COLORS
      : DISABLED_COLORS;

  const msg =
    'message' in update
      ? update.message
      : 'edited_message' in update
      ? update.edited_message
      : 'channel_post' in update
      ? update.channel_post
      : 'edited_channel_post' in update
      ? update.edited_channel_post
      : null;

  function formatMessageID(msg: tg.Message): string {
    return colors.id(String(msg.message_id));
  }

  function formatChat(chat: tg.Chat): string {
    return 'title' in chat ? ` ${colors.chat(chat.title)}:` : '';
  }

  function formatUser(user: tg.User | tg.Contact): string {
    let name = user.first_name;
    if (user.last_name != null) name += ` ${user.last_name}`;
    return colors.user(name);
  }

  function formatSender(msg: tg.Message): string {
    if ('from' in msg && msg.from != null) {
      return ` ${formatUser(msg.from)}`;
    }
    if ('author_signature' in msg && msg.author_signature != null) {
      return ` ${colors.user(msg.author_signature)}`;
    }
    return '';
  }

  function formatForward(msg: tg.Message): string {
    if ('forward_from' in msg && msg.forward_from != null) {
      return ` fwd[${formatUser(msg.forward_from)}]`;
    }
    if ('forward_from_chat' in msg && msg.forward_from_chat != null) {
      return ` fwd[${formatChat(msg.forward_from_chat).slice(1, -1)}]`;
    }
    if ('forward_sender_name' in msg && msg.forward_sender_name != null) {
      return ` fwd[${colors.user(msg.forward_sender_name)}]`;
    }
    return '';
  }

  function formatReply(msg: tg.Message): string {
    return 'reply_to_message' in msg && msg.reply_to_message != null
      ? ` re[${formatMessageID(msg.reply_to_message)}]`
      : '';
  }

  function formatEdit(msg: tg.Message): string {
    return 'edit_date' in msg ? ' (edited)' : '';
  }

  function formatMessageContent(msg: tg.Message): string {
    let str = '';

    if ('text' in msg) {
      str += msg.text;
    } else if ('sticker' in msg) {
      if (msg.sticker.emoji != null) str += `${msg.sticker.emoji}   `;
      str += colors.type('sticker');
    } else if ('dice' in msg) {
      str += `${colors.type('dice')} ${msg.dice.emoji} with value ${msg.dice.value}`;
    } else if ('poll' in msg) {
      const pollAnonymity = msg.poll.is_anonymous ? 'anonymous ' : '';
      const pollType =
        msg.poll.type === 'quiz' ? 'quiz' : msg.poll.type === 'regular' ? 'regular poll' : 'poll';
      str += `${colors.type(`${pollAnonymity}${pollType}`)}`;
    } else if ('contact' in msg) {
      str += `${colors.type('contact')} of ${formatUser(msg.contact)}`;
    } else if ('location' in msg) {
      str += `${colors.type('location')} on ${msg.location.latitude} ${msg.location.longitude}`;
    } else if ('game' in msg) {
      str += `${colors.type('game')} ${msg.game.title}`;
    } else if ('pinned_message' in msg) {
      str += `${colors.type('pinned message')} #${msg.pinned_message.message_id}`;
    } else if ('new_chat_members' in msg) {
      str += `added ${msg.new_chat_members.map(formatUser).join(', ')}`;
    } else if ('left_chat_member' in msg) {
      str += `removed ${formatUser(msg.left_chat_member)}`;
    } else if ('new_chat_title' in msg) {
      str += `changed chat title`;
    } else if ('new_chat_photo' in msg) {
      str += `changed chat photo`;
    } else {
      str += colors.type(getMessageType(msg) ?? 'message');
    }

    if ('caption' in msg) str += `, ${msg.caption}`;

    return str;
  }

  if (msg) {
    let str = `[${formatMessageID(msg)}]`;
    str += formatChat(msg.chat);
    str += formatSender(msg);
    str += formatForward(msg);
    str += formatReply(msg);
    str += formatEdit(msg);
    str += ': ';
    str += formatMessageContent(msg);
    return str;
  }

  if ('callback_query' in update) {
    let str = `[${colors.type('(callback query)')} ${colors.id(update.callback_query.id)}]`;
    if (update.callback_query.message != null) {
      str = `[${formatMessageID(update.callback_query.message)}]`;
      str += formatChat(update.callback_query.message.chat);
    }
    str += ` ${formatUser(update.callback_query.from)}`;
    if ('data' in update.callback_query) {
      str += `: ${colors.type('action')}: ${update.callback_query.data}`;
    } else if ('game_short_name' in update.callback_query) {
      str += `: ${colors.type('game')}: ${update.callback_query.game_short_name}`;
    }
    return str;
  }

  if ('inline_query' in update) {
    let str = `[${colors.type('(inline query)')} ${colors.id(update.inline_query.id)}]`;
    str += ` ${formatUser(update.inline_query.from)}`;
    str += `: ${update.inline_query.query}`;
    return str;
  }

  if ('chosen_inline_result' in update) {
    let str = colors.type('chosen inline result:');
    str += ` ${formatUser(update.chosen_inline_result.from)}`;
    str += ` chose ${colors.id(update.chosen_inline_result.result_id)}`;
    if (update.chosen_inline_result.query.length > 0) {
      str += ` via query: ${update.chosen_inline_result.query}`;
    }
    return str;
  }

  if ('shipping_query' in update) {
    let str = `[${colors.type('(shipping query)')} ${colors.id(update.shipping_query.id)}]`;
    str += ` from ${formatUser(update.shipping_query.from)}`;
    return str;
  }

  if ('pre_checkout_query' in update) {
    let str = `[${colors.type('(pre-checkout query)')} ${colors.id(update.pre_checkout_query.id)}]`;
    str += ` from ${formatUser(update.pre_checkout_query.from)}`;
    return str;
  }

  if ('poll' in update) {
    let str = `[${colors.type('(poll)')} ${colors.id(update.poll.id)}]`;
    str += ` total voters: ${update.poll.total_voter_count}`;
    return str;
  }

  if ('poll_answer' in update) {
    let str = `[${colors.type('(poll answer)')} to ${colors.id(update.poll_answer.poll_id)}]`;
    str += ` ${formatUser(update.poll_answer.user)}:`;
    if (update.poll_answer.option_ids.length > 0) {
      str += ` voted [${update.poll_answer.option_ids.join(', ')}]`;
    } else {
      str += ' retracted their vote';
    }
    return str;
  }

  return 'unsupported update type';
}

export = format;
