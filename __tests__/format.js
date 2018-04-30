const format = require('../lib/format');
const testUpdates = require('./testUpdates.json');

describe('telegraf-update-logger/lib/format', () => {
  describe('export default function format', () => {
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
