const MESSAGE_TYPES = [
  'audio',
  'contact',
  'document',
  'location',
  'photo',
  'sticker',
  'text',
  'venue',
  'video',
  'video_note',
  'voice'
];

const getMessageType = msg => MESSAGE_TYPES.find(type => msg[type]);

module.exports = getMessageType;
