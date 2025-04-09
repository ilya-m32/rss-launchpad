import type { Browser, FeedResult, IFeedExtractor, PageStateResult, PageSyncResult } from "../types";
import directFeedExtractor from "./direct/index.js";
import redditDerivedExtractor from "./reddit/index.js";
import youtubeDerivedExtractor from "./youtube/index.js";

const DERIVED_FEED_EXTRACTORS: IFeedExtractor[] = [
  // Add more here
  youtubeDerivedExtractor,
  redditDerivedExtractor,
] as const;

export async function getPageFeeds(browserObj: Browser): Promise<FeedResult> {
  const pageState = await getPageState(browserObj);

  const feedsResult = await fetchFeedsByExecutor(browserObj, directFeedExtractor);
  // if the direct feed requests failed, whole workflow is likely to be broken
  if (feedsResult.error || !feedsResult.results) {
    return feedsResult;
  }

  const pageFeedResults = await Promise.all(
    getMatchingFeedExtractors(pageState).map(fetchFeedsByExecutor.bind(void 0, browserObj)),
  );

  // Enrich feed output
  for (const item of pageFeedResults) {
    if (item.results?.feeds?.length) {
      feedsResult.results.feeds.push(...item.results.feeds);
    }
  }

  return feedsResult;
}

async function getPageState(browserObj: Browser): Promise<PageStateResult> {
  const output = await executeActiveTab<PageStateResult>(browserObj, {
    file: "extractors/__inject-page-state.js",
  });

  return (
    output.results?.[0] ?? {
      url: "https://unknown/",
    }
  );
}

function executeActiveTab<TResult>(browserObj: Browser, opts: { file: string }) {
  return browserObj.tabs
    .executeScript(opts)
    .then((results) => {
      // This function is called after the script has been executed
      if (browserObj.runtime.lastError || !results || !results.length) {
        throw Error(String(browserObj.runtime.lastError));
      }

      return { results: results as TResult[], error: undefined };
    })
    .catch((error) => {
      console.error("Error on script execution: ", error);
      return { error, results: undefined };
    });
}

async function fetchFeedsByExecutor(browserObj: Browser, extractor: IFeedExtractor): Promise<FeedResult> {
  const output = await executeActiveTab<PageSyncResult>(browserObj, {
    file: extractor.getScriptPath(),
  });

  return output.results ? { results: output.results[0] } : output;
}

function getMatchingFeedExtractors({ url }: { url: string }) {
  return DERIVED_FEED_EXTRACTORS.filter((extractor) => extractor.match(url));
}
