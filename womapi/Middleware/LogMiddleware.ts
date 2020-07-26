import { Lincoln, LoggerType } from "dent/lincoln/mod.ts";
import { Context, MiddlewareTarget, Inject, Injectable } from "alosaur/mod.ts";

@Injectable()
export class LogMiddleware implements MiddlewareTarget<unknown> {
  private readonly log: Lincoln;

  constructor(@Inject(LoggerType) logger: Lincoln) {
    this.log = logger.extend("middleware");
  }

  async onPreRequest(context: Context<unknown>) {
    const headers = this.headers(context.request.headers);
    const url = context.request.url;

    this.log.info("[begin]", { url });
    this.log.trace(`[begin:${url}]`, headers, { url });
  }

  async onPostRequest(context: Context<unknown>) {
    const headers = this.headers(context.response.headers);
    const url = context.request.url;

    this.log.trace(`[end:${url}]`, headers, { url });
    this.log.info("[end]", { url });
  }

  private headers(headers: Headers) {
    return Array.from(headers.keys()).reduce<any>((result, key) => {
      result[key] = headers.get(key);
      return result;
    }, {});
  }
}
