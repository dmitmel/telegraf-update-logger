<p align="center">
  <a href="https://telegram.org/">
    <img height="150" src="https://cdn.worldvectorlogo.com/logos/telegram.svg">
  </a>
  <a href="http://telegraf.js.org/">
    <img height="150" src="https://cdn.rawgit.com/telegraf/telegraf/develop/docs/telegraf.png">
  </a>
</p>

# telegraf-update-logger

[![Travis](https://img.shields.io/travis/dmitmel/telegraf-update-logger.svg?style=flat-square)](https://travis-ci.org/dmitmel/telegraf-update-logger)
[![Codecov](https://img.shields.io/codecov/c/github/dmitmel/telegraf-update-logger.svg?style=flat-square)](https://codecov.io/gh/dmitmel/telegraf-update-logger)
[![npm](https://img.shields.io/npm/v/telegraf-update-logger.svg?style=flat-square)](http://npmjs.com/package/telegraf-update-logger)
[![MIT License](https://img.shields.io/npm/l/telegraf-update-logger.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> [Update](https://core.telegram.org/bots/api#update) logging middleware for [Telegraf](http://telegraf.js.org/)

## Install

```bash
yarn add telegraf-update-logger
```

## Examples

### log all updates to console with colors

```js
const Telegraf = require('telegraf');
const updateLogger = require('telegraf-update-logger');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(updateLogger({ colors: true }));
bot.startPolling();
```

### log channel posts to file

```js
const Telegraf = require('telegraf');
const updateLogger = require('telegraf-update-logger');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(
  updateLogger({
    filter: update => update.channel_post || update.edited_channel_post,
    log: str => fs.appendFileSync(str)
  })
);
bot.startPolling();
```

### log all updates with custom colors

```js
const Telegraf = require('telegraf');
const updateLogger = require('telegraf-update-logger');
const chalk = require('chalk');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(
  updateLogger({
    colors: {
      id: chalk.red,
      chat: chalk.yellow,
      user: chalk.green,
      type: chalk.bold
    }
  })
);
bot.startPolling();
```

### reply to all messages with formatted updates

```js
const Telegraf = require('telegraf');
const updateLogger = require('telegraf-update-logger');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.on('message', ctx => ctx.reply(updateLogger.format(ctx.update)));
bot.startPolling();
```

## API

### <code>updateLogger(options: object?): function</code>

Creates a middleware that logs every update and then invokes the next middleware.

**Params**:

* **`options`** `object?` `= {}`
  * **`.filter`** <code>(update: <a href="https://core.telegram.org/bots/api#update">Update</a>) => boolean</code> – a function that determines which updates should be logged
  * **`.log`** `(formattedUpdate: string) => void` `= console.log` – a function that logs formatted updates
  * **... [`format`](#updateloggerformatupdate-update-options-object-string) options**

### <code>updateLogger.format(update: <a href="https://core.telegram.org/bots/api#update">Update</a>, options: object?): string</code>

Formats an update as string.

**Params**:

* **`update`** [Update](https://core.telegram.org/bots/api#update)
* **`options`** `object?` `= {}`
  * **`.colors`** `boolean | object` `= false` – enables/disables/sets [colors](https://github.com/chalk/chalk/)
    * **`.id`** `function` – a function that sets colors of message IDs
    * **`.chat`** `function` – a function that sets colors of chat titles
    * **`.user`** `function` – a function that sets colors of user names
    * **`.type`** `function` – a function that sets colors of message types

## Contribute

PRs accepted.

## License

[MIT](LICENSE) © [Dmytro Meleshko](https://github.com/dmitmel)
