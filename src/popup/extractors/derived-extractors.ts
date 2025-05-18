import type { IFeedExtractor } from "../types";
import bitchuteDerivedExtractor from "./bitchute/index.js";
import redditDerivedExtractor from "./reddit/index.js";
import substackDerivedExtractor from "./substack/index.js";
import wordpressDerivedExtractor from "./wordpress/index.js";
import youtubeDerivedExtractor from "./youtube/index.js";

export const DERIVED_FEED_EXTRACTORS: IFeedExtractor[] = [
  // Add more here
  youtubeDerivedExtractor,
  redditDerivedExtractor,
  wordpressDerivedExtractor,
  substackDerivedExtractor,
  bitchuteDerivedExtractor,
] as const;
