import * as tg from 'typegram';
import * as format_ from './format';

interface Context {
  update: tg.Update;
}

// <https://github.com/telegraf/telegraf/blob/a24ec036747e2cf462c8496a25b3a8755264b212/src/middleware.ts#L9-L13>
type MiddlewareFn = (ctx: Context, next: () => Promise<void>) => Promise<unknown> | void;

namespace updateLogger {
  export interface Options extends updateLogger.format.Options {
    filter?: ((update: tg.Update) => boolean) | null;
    log?: ((formattedUpdate: string) => void) | null;
  }
}

function updateLogger(options: updateLogger.Options): MiddlewareFn {
  options ??= {};
  const filter = options.filter ?? ((_update) => true);
  const log = options.log ?? console.log;
  return (ctx, next) => {
    if (filter(ctx.update)) log(updateLogger.format(ctx.update, options));
    return next();
  };
}

namespace updateLogger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import format = format_;
}

export = updateLogger;
