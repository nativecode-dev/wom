import { Area } from "alosaur/mod.ts";

import { ServerArea } from "../ServerArea.ts";
import { AccountController } from "./AccountController.ts";
import { MountController } from "./MountController.ts";

@Area({ controllers: [AccountController, MountController] })
export class V1Area extends ServerArea {}
