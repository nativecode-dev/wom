import { Area } from "alosaur/mod.ts";

import { ServerArea } from "../ServerArea.ts";
import { HomeController } from "./HomeController.ts";

@Area({ controllers: [HomeController] })
export class HomeArea extends ServerArea {}
