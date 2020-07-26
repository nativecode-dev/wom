import { Env } from "dent/env/mod.ts";
import { container } from "alosaur/mod.ts";
import { ObjectMerge } from "dent/object-merge/mod.ts";
import { LincolnLogDebug } from "dent/lincoln-debug/mod.ts";
import { CouchStore } from "deno-connectors/connect-couchdb/mod.ts";

import {
  Lincoln,
  LoggerType,
  createLogger,
  createScrubTransformer,
  createAwsTransformer,
  createUriTransformer,
} from "dent/lincoln/mod.ts";

import {
  ServerConfig,
  ServerConfigToken,
  DefaultServerConfig,
} from "./Configuration/ServerConfig.ts";

import { Server } from "./API/Server.ts";
import { Extract } from "./Helpers/Extract.ts";
import { ConfigManager } from "./Configuration/ConfigManager.ts";

const logger = createLogger("wom");

logger.interceptors([
  createScrubTransformer(["apikey", "api_key", "password", "token"]),
  createAwsTransformer,
  createUriTransformer,
]);

LincolnLogDebug.observe(logger);

const envname = Deno.env.get("DENO_ENV") || "test";
const envobj = new Env({ env: Deno.env.toObject(), prefix: [envname] });
const env: any = envobj.toObject();

async function dependencies(config: ServerConfig) {
  const manager = container.resolve(ConfigManager);
  const envconnections = env[envname] || { connections: {} };

  const merged = ObjectMerge.merge<ServerConfig>(DefaultServerConfig, config, {
    connections: ObjectMerge.merge(
      config.connections,
      Extract(envconnections, "couchdb")
    ),
  });

  const store = new CouchStore(merged.connections.couchdb);
  const dbname = config.connections.couchdb.name;

  if (envname === "test" && (await store.exists(dbname))) {
    await store.delete(dbname);
  }

  if ((await store.exists(dbname)) === false) {
    await store.create(dbname);
  }

  const servercfg = await manager.read<ServerConfig>("womapi", merged);

  container.registerInstance<CouchStore>(CouchStore, store);
  container.registerInstance<Lincoln>(LoggerType, logger);
  container.registerInstance<ServerConfig>(ServerConfigToken, servercfg);
}

export async function main(config: ServerConfig) {
  await dependencies(config);

  const server = container.resolve(Server);
  await server.start();
}
