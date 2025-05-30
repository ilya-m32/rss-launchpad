import type { IFeedExtractor } from "../../types";

const YOUTUBE_DOMAINS = ["youtube.com", "youtu.be", "m.youtube.com"] as const;
const youtubeDerivedExtractor: IFeedExtractor = {
  match(pageState) {
    const { hostname } = new URL(pageState.url);
    return YOUTUBE_DOMAINS.some((domain) => hostname.endsWith(domain));
  },

  getScriptPath() {
    return "extractors/youtube/__inject.js";
  },
};

export default youtubeDerivedExtractor;
