const stripAnsi = require('strip-ansi');
const format = require('../lib/format');
const testUpdates = require('./testUpdates.json');

describe('telegraf-update-logger/lib/format', () => {
  describe('export default function format', () => {
    const UPDATE_WITH_ALL_COLORS = Object.assign({}, testUpdates.photo, {
      message: Object.assign({}, testUpdates.photo.message, {
        chat: {
          id: 456,
          title: 'Test Group',
          type: 'group'
        }
      })
    });

    function testColorsFlag(colors) {
      // when:
      const formattedUpdate = format(UPDATE_WITH_ALL_COLORS, { colors });
      // then:
      const formattedUpdateWithoutColors = stripAnsi(formattedUpdate);
      if (colors)
        expect(formattedUpdate).not.toEqual(formattedUpdateWithoutColors);
      else expect(formattedUpdate).toEqual(formattedUpdateWithoutColors);
    }

    it('disables colors by default', () => testColorsFlag());
    it('does not use colors if they are disabled', () => testColorsFlag(false));
    it('uses colors if they are enabled', () => testColorsFlag(true));

    it('supports custom color maps', () => {
      // given:
      const colorNames = ['id', 'chat', 'user', 'type'];
      const colorMap = {};
      colorNames.forEach(color => {
        colorMap[color] = jest.fn(str => str);
      });
      // when:
      format(UPDATE_WITH_ALL_COLORS, { colors: colorMap });
      // then:
      colorNames.forEach(color => {
        const colorFn = colorMap[color];
        expect(colorFn).toHaveBeenCalledTimes(1);
      });
    });

    describe('it works when message is', () => {
      Object.keys(testUpdates).forEach(testName => {
        it(testName, () => {
          // given:
          const update = testUpdates[testName];
          // when:
          const formattedUpdate = format(update);
          // then:
          expect(formattedUpdate).toMatchSnapshot();
        });
      });
    });
  });
});
