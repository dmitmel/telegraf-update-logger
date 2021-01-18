const MESSAGE_TYPES = [
  'audio',
  'contact',
  'dice',
  'document',
  'location',
  'photo',
  'poll',
  'sticker',
  'text',
  'venue',
  'video',
  'video_note',
  'voice',
];

function getMessageType(msg) {
  return MESSAGE_TYPES.find((type) => msg[type] != null);
}

module.exports = Object.assign(getMessageType, { MESSAGE_TYPES });
