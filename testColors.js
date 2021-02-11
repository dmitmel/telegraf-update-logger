const format = require('./dist/format');
const testUpdates = require('./__tests__/testUpdates.json');

console.log();

Object.keys(testUpdates).forEach((name) => {
  const update = testUpdates[name];
  console.log(format(update, { colors: true }));
});

console.log();
