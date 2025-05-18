import type { IFeedExtractor } from "../../types";

const bitchuteDerivedExtractor: IFeedExtractor = {
  match(pageState) {
    const hostname = URL.parse(pageState.url)?.hostname;
    return hostname ? /^(.+\.)?bitchute\.com$/.test(hostname) : false;
  },

  getScriptPath() {
    return "extractors/bitchute/__inject.js";
  },
};

export default bitchuteDerivedExtractor;
