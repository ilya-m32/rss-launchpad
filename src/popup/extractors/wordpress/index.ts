import type { IFeedExtractor } from "../../types";

const wordpressDerivedExtractor: IFeedExtractor = {
  match(pageState) {
    return pageState.siteType.isWordpressBased;
  },

  getScriptPath() {
    return "extractors/wordpress/__inject.js";
  },
};

export default wordpressDerivedExtractor;
