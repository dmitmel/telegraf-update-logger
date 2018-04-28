beforeEach(() => jest.resetModules());

function mockWithFormat(mockFormat) {
  jest.doMock('../lib/format', () => mockFormat);
  return require('../');
}

describe('export function format()', () => {
  it("is re-exported from './lib/format.js'", () => {
    // given:
    const format = () => {};
    // when:
    const updateLogger = mockWithFormat(format);
    // then:
    expect(updateLogger.format).toBe(format);
  });
});

describe('export default function updateLogger', () => {
  it('returns a function', () => {
    // given:
    const updateLogger = mockWithFormat(() => {});
    // when:
    const result = updateLogger();
    // then:
    expect(result).toBeInstanceOf(Function);
  });

  describe('returned middleware', () => {
    function runMiddleware({
      format = () => {},
      options,
      update,
      next = () => {}
    }) {
      const updateLogger = mockWithFormat(format);
      const middleware = updateLogger(options);
      return middleware({ update }, next);
    }

    it("calls 'format' with default options", () => {
      // given:
      const format = jest.fn();
      const update = { foo: 'bar' };
      // when:
      runMiddleware({ format, update });
      // then:
      expect(format).toHaveBeenCalledTimes(1);
      expect(format).toHaveBeenCalledWith(update, {});
    });

    it("calls 'format' with provided options", () => {
      // given:
      const format = jest.fn();
      const options = { some: 'thing' };
      const update = { foo: 'bar' };
      // when:
      runMiddleware({ format, options, update });
      // then:
      expect(format).toHaveBeenCalledTimes(1);
      expect(format).toHaveBeenCalledWith(update, options);
    });

    it("calls 'console.log'", () => {
      // given:
      const update = { foo: 'bar' };
      const updateStr = 'foo bar';
      const log = jest.spyOn(global.console, 'log');
      // when:
      runMiddleware({ format: () => updateStr, update });
      // then:
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(updateStr);
      log.mockRestore();
    });

    it('calls custom logger', () => {
      // given:
      const update = { foo: 'bar' };
      const updateStr = 'foo bar';
      const log = jest.fn();
      // when:
      runMiddleware({ format: () => updateStr, options: { log }, update });
      // then:
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(updateStr);
    });

    it('calls filter with provided update', () => {
      // given:
      const filter = jest.fn();
      const update = { foo: 'bar' };
      // when:
      runMiddleware({ options: { filter }, update });
      // then:
      expect(filter).toHaveBeenCalledTimes(1);
      expect(filter).toHaveBeenCalledWith(update);
    });

    function createFilterTests({ name, filter, shouldLog }) {
      describe(name, () => {
        it('calls next middleware', () => {
          // given:
          const nextReturnValue = { foo: 'bar' };
          const next = jest.fn(() => nextReturnValue);
          // when:
          const result = runMiddleware({ options: { filter }, next });
          // then:
          expect(result).toBe(nextReturnValue);
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
        });

        it(shouldLog ? 'logs update' : 'does not log update', () => {
          // given:
          const update = { foo: 'bar' };
          const log = jest.fn();
          // when:
          runMiddleware({ options: { filter, log }, update });
          // then:
          expect(log).toHaveBeenCalledTimes(shouldLog ? 1 : 0);
        });
      });
    }

    createFilterTests({
      name: '(when filter is not provided)',
      shouldLog: true
    });

    createFilterTests({
      name: "(when filter returns 'true')",
      filter: () => true,
      shouldLog: true
    });

    createFilterTests({
      name: "(when filter returns 'false')",
      filter: () => false,
      shouldLog: false
    });
  });
});
