const getMessageType = require('../lib/getMessageType');

const { MESSAGE_TYPES } = getMessageType;

describe('telegraf-update-logger/lib/getMessageType', () => {
  describe('export const MESSAGE_TYPES', () => {
    it('is an array of strings', () => {
      expect(MESSAGE_TYPES).toEqual(
        expect.arrayContaining([expect.any(String)]),
      );
    });
  });

  describe('export default function getMessageType', () => {
    MESSAGE_TYPES.forEach((type) => {
      it(`works for '${type}' messages`, () => {
        // given:
        const update = { [type]: { foo: 'bar' } };
        // when:
        const result = getMessageType(update);
        // then:
        expect(result).toBe(type);
      });
    });
  });
});
