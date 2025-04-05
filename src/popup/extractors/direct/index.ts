import type { IFeedExtractor } from "../../types";

const directFeedExtractor: IFeedExtractor = {
  match() {
    return true;
  },

  getScriptPath() {
    return "extractors/direct/__inject.js";
  },
};

export default directFeedExtractor;
