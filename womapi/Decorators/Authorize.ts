import {
  Content,
  Context,
  HookTarget,
  BusinessType,
  getMetadataArgsStorage,
  container,
} from "alosaur/mod.ts";

type AuthorizeRoleType = string | undefined;

export function Authorize(role?: AuthorizeRoleType): Function {
  return function (object: any, method?: string) {
    getMetadataArgsStorage().hooks.push({
      object,
      method,
      instance: container.resolve(AutorizeHook),
      payload: role,
      target: object.constructor,
      type: method ? BusinessType.Action : BusinessType.Controller,
    });
  };
}

export class AutorizeHook implements HookTarget<unknown, AuthorizeRoleType> {
  onPreAction(context: Context<unknown>, role: AuthorizeRoleType) {
    const queryParams = getQueryParams(context.request.url);

    if (queryParams == undefined || queryParams.get("role") !== role) {
      context.response.result = Content({ error: { token: false } }, 403);
      context.response.setImmediately();
    }
  }
}
