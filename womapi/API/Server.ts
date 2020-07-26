import { plainToClass } from "transformer";

import { Lincoln, LoggerType } from "dent/lincoln/mod.ts";
import { App, Injectable, Inject, container } from "alosaur/mod.ts";

import { V1Area } from "./V1/V1Area.ts";
import { HomeArea } from "./Home/HomeArea.ts";
import { LogMiddleware } from "../Middleware/LogMiddleware.ts";

import {
  ServerConfig,
  ServerConfigToken,
} from "../Configuration/ServerConfig.ts";

interface ServerState {}

@Injectable()
export class Server {
  private readonly app: App<ServerState>;
  private readonly log: Lincoln;

  constructor(
    @Inject(ServerConfigToken) private readonly config: ServerConfig,
    @Inject(LoggerType) logger: Lincoln
  ) {
    this.app = new App<ServerState>({
      areas: [HomeArea, V1Area],
      middlewares: [LogMiddleware],
    });

    this.log = logger.extend("api");
  }

  async start() {
    this.log.debug("[start]", this.config);

    this.app.use(/\//, container.resolve(LogMiddleware));

    this.app.useTransform({
      type: "body",
      getTransform: (transform: any, body: any) =>
        plainToClass(transform, body),
    });

    return await this.app.listen({
      hostname: this.config.hostname,
      port: this.config.port,
    });
  }
}
