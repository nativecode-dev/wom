import { Content, Redirect } from "alosaur/mod.ts";

import { Essentials } from "dent/ts-types/mod.ts";
import {
  Document,
  DocumentCollection,
  DocumentKeySelector,
} from "dent/object-doc/mod.ts";

import { ServerConfig } from "../Configuration/ServerConfig.ts";

interface Transform<T> {
  (config: T): T;
}

export abstract class ServerController {
  constructor(protected readonly config: ServerConfig) {}

  protected async getAll<T extends Document>(
    collection: DocumentCollection<T>,
    transform: Transform<T>
  ) {
    try {
      const items = await collection.all();
      return this.OK(items.map((item) => transform(item)));
    } catch (error) {
      return this.NoContent([]);
    }
  }

  protected async getDocument<T extends Document>(
    collection: DocumentCollection<T>,
    document_id: string,
    transform: Transform<T>
  ) {
    try {
      const item = await collection.get(document_id);

      if (item === null) {
        return this.NotFound({ document_id });
      }

      return this.OK(transform(item));
    } catch {
      return this.InternalServerError({ document_id });
    }
  }

  protected async createDocument<T extends Document>(
    collection: DocumentCollection<T>,
    document: Essentials.DeepPartial<T>,
    document_key: DocumentKeySelector<T>,
    transform: Transform<T>
  ) {
    try {
      if (document.name) {
        const existing = await collection.get(document.name);

        if (existing === null) {
          const created = await collection.update(document, document_key);

          return this.Created(transform(created));
        }

        return this.Conflict(transform(existing));
      }
    } catch {
      return this.NotAcceptable(document);
    }
  }

  protected async deleteDocument<T extends Document>(
    collection: DocumentCollection<T>,
    document_id: string
  ) {
    try {
      if ((await collection.get(document_id)) === null) {
        return this.NotFound({ document_id });
      }

      await collection.delete(document_id);
      return this.OK({ document_id });
    } catch {
      return this.InternalServerError({ document_id });
    }
  }

  protected async patchDocument<T extends Document>(
    collection: DocumentCollection<T>,
    document: Essentials.DeepPartial<T>,
    document_id: string,
    transform: Transform<T>
  ) {
    try {
      const item = await collection.get(document_id);

      if (item === null) {
        return this.NotFound(document);
      }

      return this.Accepted(transform(item));
    } catch {
      return this.InternalServerError(document);
    }
  }

  protected async putDocument<T extends Document>(
    collection: DocumentCollection<T>,
    document: Essentials.DeepPartial<T>,
    document_id: string,
    document_key: DocumentKeySelector<T>,
    transform: Transform<T>
  ) {
    try {
      const item = await collection.get(document_id);

      if (item === null) {
        const updated = await collection.update(document, document_key);

        return this.Created(transform(updated));
      }

      return this.Accepted(transform(item));
    } catch {
      return this.InternalServerError(document);
    }
  }

  protected Accepted<T>(resposne: T) {
    return Content(resposne, 202);
  }

  protected BadRequest<T>(response: T) {
    return Content(response, 400);
  }

  protected Conflict<T>(response: T) {
    return Content(response, 409);
  }

  protected Created<T>(resposne: T) {
    return Content(resposne, 201);
  }

  protected Forbidden<T>(response: T) {
    return Content(response, 403);
  }

  protected InternalServerError<T>(response: T) {
    return Content(response, 500);
  }

  protected MovedPermanently(redirect: string) {
    return Redirect(redirect);
  }

  protected NotAcceptable<T>(response: T) {
    return Content(response, 406);
  }

  protected NoContent<T>(response: T) {
    return Content(response, 204);
  }

  protected NotFound<T>(response: T) {
    return Content(response, 404);
  }

  protected PartialContent<T>(response: T) {
    return Content(response, 206);
  }

  protected OK<T>(response: T) {
    return Content(response, 200);
  }

  protected Unauthorized<T>(response: T) {
    return Content(response, 401);
  }
}
