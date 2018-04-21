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

bot.use(
  updateLogger({
    /* options */
  })
);

bot.use(ctx =>
  ctx.reply(
    updateLogger.format(ctx.update, {
      /* options */
    })
  )
);

bot.startPolling();
```

## API

### <code>updateLogger([<a href="#options">options</a>]): function</code>

_TODO_

### <code>updateLogger.format(<a href="https://core.telegram.org/bots/api#update">update</a>, [<a href="#options">options</a>]): string</code>

_TODO_

### <code>Options</code>

_TODO_

## Contribute

PRs accepted.

## License

[MIT](LICENSE) © [Dmytro Meleshko](https://github.com/dmitmel)
