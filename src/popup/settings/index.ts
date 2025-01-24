import { getBrowser } from "../utils.js";
import { Settings } from "./impl.js";

export const settings = await new Settings(getBrowser()).init();
