import { ConnectorOptions } from "dent/connector/mod.ts";
import { Essentials } from "dent/ts-types/mod.ts";

import { Config } from "./Config.ts";

export interface ServerConfig extends Config {
  hostname: string;
  port: number;

  connections: {
    couchdb: ConnectorOptions;
  };
}

export const DefaultServerConfig: Essentials.DeepPartial<ServerConfig> = {
  hostname: "localhost",
  port: 9000,

  connections: {
    couchdb: {
      endpoint: {
        host: "localhost",
      },
      name: "womapi",
    },
  },
};

export const ServerConfigToken = Symbol("ServerConfig");
