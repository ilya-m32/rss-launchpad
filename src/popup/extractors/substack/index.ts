import type { IFeedExtractor } from "../../types";

const substackDerivedExtractor: IFeedExtractor = {
  match(pageState) {
    const hostname = URL.parse(pageState.url)?.hostname;
    return hostname ? /^(.+\.)?substack\.com$/.test(hostname) : false;
  },

  getScriptPath() {
    return "extractors/substack/__inject.js";
  },
};

export default substackDerivedExtractor;
