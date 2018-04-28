// eslint-disable-next-line import/no-extraneous-dependencies
const Telegraf = require('telegraf');
const updateLogger = require('./');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(updateLogger({ colors: true }));

bot.use(ctx => ctx.reply(updateLogger.format(ctx.update)));

bot.startPolling();
