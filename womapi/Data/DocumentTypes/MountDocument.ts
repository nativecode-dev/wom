import { MetaDocument } from "../MetaDocument.ts";

export type MountType = "nfs" | "smb";

export interface MountDocument extends MetaDocument {
  host: string;
  name: string;
  path: string;
  type: MountType;
}
