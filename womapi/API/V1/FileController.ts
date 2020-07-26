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

import { FileDocument } from "../../Data/DocumentTypes/FileDocument.ts";

import { Extract } from "../../Helpers/Extract.ts";
import { DocumentContext } from "../../Data/DocumentContext.ts";

interface FileInfo {
  filename: string;
  filepath: string;
}

export class FileCreate {
  filename: string;
  filepath: string;
}

export class FileUpdate {
  filename?: string;
  filepath?: string;
}

function toFileInfo(instance: FileDocument): FileInfo {
  return Extract(instance, "file_id", "host", "name", "path", "type");
}

@Controller("/v1/files")
export class FileController extends ServerController {
  private readonly log: Lincoln;

  constructor(
    @Inject(ServerConfigToken) config: ServerConfig,
    private readonly context: DocumentContext,
    @Inject(LoggerType) logger: Lincoln
  ) {
    super(config);
    this.log = logger.extend("files");
  }

  @Get("")
  async all() {
    return await this.getAll(this.context.files, toFileInfo);
  }

  @Post("")
  async create(@Body(FileCreate) file: FileCreate) {
    return await this.createDocument(
      this.context.files,
      { ...file },
      (key) => [key.filepath, key.filename].join("_"),
      toFileInfo
    );
  }

  @Delete("/:file_id")
  async delete(@Param("file_id") file_id: string) {
    return await this.deleteDocument(this.context.files, file_id);
  }

  @Get("/:file_id")
  async get(@Param("file_id") file_id: string) {
    return await this.getDocument(this.context.files, file_id, toFileInfo);
  }

  @Patch("/:file_id")
  async patch(
    @Param("file_id") file_id: string,
    @Body(FileUpdate) file: FileUpdate
  ) {
    return await this.patchDocument(
      this.context.files,
      { ...file },
      file_id,
      toFileInfo
    );
  }

  @Put("/:file_id")
  async update(
    @Param("file_id") file_id: string,
    @Body(FileUpdate) file: FileUpdate
  ) {
    return await this.putDocument(
      this.context.files,
      { ...file },
      file_id,
      (key) => [key.filepath, key.filename].join("_"),
      toFileInfo
    );
  }
}
