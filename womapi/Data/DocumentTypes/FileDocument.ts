import { MetaDocument } from "../MetaDocument.ts";

export interface FileDocument extends MetaDocument {
  filename: string
  filepath: string
}
