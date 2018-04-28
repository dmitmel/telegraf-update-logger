const updateLogger = require('../');
const updateLoggerMiddleware = require('../lib/middleware');

describe('telegraf-update-logger', () => {
  it("re-exports everything from './lib/middleware.js'", () => {
    expect(updateLogger).toBe(updateLoggerMiddleware);
  });
});
