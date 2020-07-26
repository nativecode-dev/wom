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
  ServerConfig,
  ServerConfigToken,
} from "../../Configuration/ServerConfig.ts";

import { DocumentContext } from "../../Data/DocumentContext.ts";
import { Extract } from "../../Helpers/Extract.ts";
import { AccountDocument } from "../../Data/DocumentTypes/AccountDocument.ts";

interface AccountInfo {
  account_id: string;
  name: string;
}

export class AccountCreate {
  name: string;
}

export class AccountUpdate {
  name: string;
}

function toAccountInfo(instance: AccountDocument): AccountInfo {
  return Extract(instance, "account_id", "name");
}

@Controller("/v1/accounts")
export class AccountController extends ServerController {
  private readonly log: Lincoln;

  constructor(
    @Inject(ServerConfigToken) config: ServerConfig,
    private readonly context: DocumentContext,
    @Inject(LoggerType) logger: Lincoln
  ) {
    super(config);
    this.log = logger.extend("accounts");
  }

  @Get("")
  async all() {
    return await this.getAll(this.context.accounts, toAccountInfo);
  }

  @Post("")
  async create(@Body(AccountCreate) account: AccountCreate) {
    return await this.createDocument(
      this.context.accounts,
      { account_id: account.name, name: account.name },
      (key) => key.name,
      toAccountInfo
    );
  }

  @Delete("/:account_id")
  async delete(@Param("account_id") account_id: string) {
    return await this.deleteDocument(this.context.accounts, account_id);
  }

  @Get("/:account_id")
  async get(@Param("account_id") account_id: string) {
    return await this.getDocument(
      this.context.accounts,
      account_id,
      toAccountInfo
    );
  }

  @Patch("/:account_id")
  async patch(
    @Param("account_id") account_id: string,
    @Body(AccountUpdate) account: AccountUpdate
  ) {
    return await this.patchDocument(
      this.context.accounts,
      { account_id: account.name, name: account.name },
      account_id,
      toAccountInfo
    );
  }

  @Put("/:account_id")
  async update(
    @Param("account_id") account_id: string,
    @Body(AccountUpdate) account: AccountUpdate
  ) {
    return await this.putDocument(
      this.context.accounts,
      { account_id: account.name, name: account.name },
      account_id,
      (key) => key.name,
      toAccountInfo
    );
  }
}
