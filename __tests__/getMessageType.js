const getMessageType = require('../lib/getMessageType');

const { MESSAGE_TYPES } = getMessageType;

it('exports available message types an array of strings', () => {
  expect(MESSAGE_TYPES).toEqual(expect.arrayContaining([expect.any(String)]));
});

describe('getMessageType', () => {
  MESSAGE_TYPES.forEach(type => {
    it(`works for '${type}' messages`, () => {
      const result = getMessageType({ [type]: {} });
      expect(result).toBe(type);
    });
  });
});
