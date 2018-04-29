<p align="center">
  <a href="https://telegram.org/">
    <img height="150" src="https://cdn.worldvectorlogo.com/logos/telegram.svg">
  </a>
  <a href="http://telegraf.js.org/">
    <img height="150" src="https://cdn.rawgit.com/telegraf/telegraf/develop/docs/telegraf.png">
  </a>
</p>

# telegraf-update-logger

> Update logging middleware for [Telegraf](http://telegraf.js.org/)

## Install

```bash
yarn add telegraf-update-logger
```

## Usage

```js
const Telegraf = require('telegraf');
const updateLogger = require('telegraf-update-logger');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(updateLogger());

bot.startPolling();
```

## API

### <code>updateLogger(options: <a href="#options">Options</a>?): function</code>

Creates a middleware that logs every [update](https://core.telegram.org/bots/api#update) and then invokes the next middleware.

### <code>updateLogger.format(update: <a href="https://core.telegram.org/bots/api#update">Update</a>, options: <a href="#options">Options</a>?): string</code>

Formats `update` as string.

### <code>Options</code>

* **`colors`** `: boolean` `= false`

| Param    | Type                                                                                             | Default       | Description                                                                   |
| -------- | ------------------------------------------------------------------------------------------------ | ------------- | ----------------------------------------------------------------------------- |
| `filter` | <code>(update: <a href="https://core.telegram.org/bots/api#update">Update</a>) => boolean</code> |               | A function that determines which updates should be logged (_middleware-only_) |
| `log`    | `(formattedUpdate: string) => void`                                                              | `console.log` | A function that logs formatted updates (_middleware-only_)                    |
| `colors` | `boolean`                                                                                        | `false`       | Should output be [colored](https://github.com/chalk/chalk/)?                  |

## Contribute

PRs accepted.

## License

[MIT](LICENSE) © [Dmytro Meleshko](https://github.com/dmitmel)
