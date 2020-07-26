import * as FS from "std/fs/mod.ts";
import * as Path from "std/path/mod.ts";

import { Injectable } from "alosaur/mod.ts";
import { Essentials } from "dent/ts-types/mod.ts";
import { ObjectMerge } from "dent/object-merge/mod.ts";

import { Config } from "./Config.ts";

export const ConfigToken = Symbol("ConfigToken");

@Injectable()
export class ConfigManager {
  readonly cwd = Deno.cwd();
  readonly cwdcfg = Path.join(Deno.cwd(), ".config");

  async read<T extends Config>(
    name: string,
    config: Essentials.DeepPartial<T>
  ): Promise<T> {
    const filename = Path.join(this.cwdcfg, `${name}`);

    if (await FS.exists(filename)) {
      const text = await Deno.readTextFile(filename);
      return ObjectMerge.merge<T>(config, JSON.parse(text));
    }

    return ObjectMerge.merge<T>(config);
  }

  async write<T extends Config>(name: string, config: T): Promise<T> {
    const filename = Path.join(this.cwdcfg, `${name}`);

    await FS.ensureDir(this.cwdcfg);
    await Deno.writeTextFile(filename, JSON.stringify(config));

    return config;
  }
}
