import { Controller, Get, Inject } from "alosaur/mod.ts";

import { ServerController } from "../ServerController.ts";

import {
  ServerConfig,
  ServerConfigToken,
} from "../../Configuration/ServerConfig.ts";

@Controller("/")
export class HomeController extends ServerController {
  constructor(@Inject(ServerConfigToken) config: ServerConfig) {
    super(config);
  }

  @Get()
  get() {
    return this.config;
  }
}
