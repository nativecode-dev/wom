import { Args, parse } from "std/flags/mod.ts";
import { ObjectMerge } from "dent/object-merge/mod.ts";

import { main } from "./womapi/mod.ts";

import {
  DefaultServerConfig,
  ServerConfig,
} from "./womapi/Configuration/ServerConfig.ts";

interface ProgramArgs extends Args, ServerConfig {
  hostname: string;
  port: number;
}

const argv: ProgramArgs = ObjectMerge.merge<ProgramArgs>(
  DefaultServerConfig,
  parse(Deno.args)
);

await main(argv);
