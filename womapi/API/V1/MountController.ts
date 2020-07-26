import { Lincoln, LoggerType } from "dent/lincoln/mod.ts";

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Delete,
  Put,
  Patch,
} from "alosaur/mod.ts";

import { ServerController } from "../ServerController.ts";

import {
  ServerConfigToken,
  ServerConfig,
} from "../../Configuration/ServerConfig.ts";

import {
  MountDocument,
  MountType,
} from "../../Data/DocumentTypes/MountDocument.ts";

import { Extract } from "../../Helpers/Extract.ts";
import { DocumentContext } from "../../Data/DocumentContext.ts";

interface MountInfo {
  mount_id: string;
  host: string;
  name: string;
  path: string;
  type: MountType;
}

export class MountCreate {
  host: string;
  name: string;
  path: string;
  type: MountType;
}

export class MountUpdate {
  host?: string;
  name?: string;
  path?: string;
  type?: MountType;
}

function toMountInfo(instance: MountDocument): MountInfo {
  return Extract(instance, "mount_id", "host", "name", "path", "type");
}

@Controller("/v1/mounts")
export class MountController extends ServerController {
  private readonly log: Lincoln;

  constructor(
    @Inject(ServerConfigToken) config: ServerConfig,
    private readonly context: DocumentContext,
    @Inject(LoggerType) logger: Lincoln
  ) {
    super(config);
    this.log = logger.extend("mounts");
  }

  @Get("")
  async all() {
    return await this.getAll(this.context.mounts, toMountInfo);
  }

  @Post("")
  async create(@Body(MountCreate) mount: MountCreate) {
    return await this.createDocument(
      this.context.mounts,
      { mount_id: mount.name, ...mount },
      (key) => key.name,
      toMountInfo
    );
  }

  @Delete("/:mount_id")
  async delete(@Param("mount_id") mount_id: string) {
    return await this.deleteDocument(this.context.mounts, mount_id);
  }

  @Get("/:mount_id")
  async get(@Param("mount_id") mount_id: string) {
    return await this.getDocument(this.context.mounts, mount_id, toMountInfo);
  }

  @Patch("/:mount_id")
  async patch(
    @Param("mount_id") mount_id: string,
    @Body(MountUpdate) mount: MountUpdate
  ) {
    return await this.patchDocument(
      this.context.mounts,
      { mount_id: mount.name, ...mount },
      mount_id,
      toMountInfo
    );
  }

  @Put("/:mount_id")
  async update(
    @Param("mount_id") mount_id: string,
    @Body(MountUpdate) mount: MountUpdate
  ) {
    return await this.putDocument(
      this.context.mounts,
      { mount_id: mount.name, ...mount },
      mount_id,
      (key) => key.name,
      toMountInfo
    );
  }
}
