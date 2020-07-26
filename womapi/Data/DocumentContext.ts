import { Injectable, Inject } from "alosaur/mod.ts";

import { DocumentCollection } from "dent/object-doc/mod.ts";
import { CouchStore } from "deno-connectors/connect-couchdb/mod.ts";

import { AccountDocument } from "./DocumentTypes/AccountDocument.ts";
import { MountDocument } from "./DocumentTypes/MountDocument.ts";
import { ServerConfig } from "../Configuration/ServerConfig.ts";
import { ServerConfigToken } from "../Configuration/ServerConfig.ts";
import { FileDocument } from "./DocumentTypes/FileDocument.ts";

@Injectable()
export class DocumentContext {
  readonly accounts: DocumentCollection<AccountDocument>;
  readonly files: DocumentCollection<FileDocument>;
  readonly mounts: DocumentCollection<MountDocument>;

  constructor(
    @Inject(ServerConfigToken) config: ServerConfig,
    store: CouchStore
  ) {
    const dbname = config.connections.couchdb.name;
    this.accounts = store.collection<AccountDocument>(dbname, "account");
    this.files = store.collection<FileDocument>(dbname, "file");
    this.mounts = store.collection<MountDocument>(dbname, "mount");
  }
}
