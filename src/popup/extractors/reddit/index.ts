import type { IFeedExtractor } from "../../types";

const REDDIT_DOMAINS = ["reddit.com"] as const;

const redditDerivedExtractor: IFeedExtractor = {
  match(url: string) {
    const { hostname } = new URL(url);
    return REDDIT_DOMAINS.some((domain) => hostname.endsWith(domain));
  },

  getScriptPath() {
    return "extractors/reddit/__inject.js";
  },
};

export default redditDerivedExtractor;
