const format = require('../lib/format');
const testUpdates = require('./testUpdates.json');

describe('telegraf-update-logger/lib/format', () => {
  describe('export default function format', () => {
    Object.keys(testUpdates)
      .filter(testName => testUpdates[testName])
      .forEach(testName => {
        it(`handles ${testName}`, () => {
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
