import type { ISettings, KnownOpeners } from "../types";

type Opener = (feedUrl: string, settingsState: ISettings) => URL;

function noopOpener(feedUrl: string): URL {
  return new URL(feedUrl);
}

const serviceUrlGenerators: Record<KnownOpeners, Opener> = {
  feedly(feedUrl) {
    const feedly = new URL("https://feedly.com/i/subscription/feed/");
    feedly.pathname += encodeURIComponent(feedUrl);
    return feedly;
  },
  freshRss(feedUrl, settingsState) {
    const url = new URL("", settingsState.freshRssUrl);
    url.searchParams.set("c", "feed");
    url.searchParams.set("a", "add");
    url.searchParams.set("url_rss", feedUrl);
    return url;
  },
  inoreader(feedUrl) {
    const url = new URL("https://www.inoreader.com");
    url.searchParams.set("add_feed", feedUrl);
    return url;
  },
  nextcloud(feedUrl, settingsState) {
    const url = new URL("apps/news", settingsState.nextcloudUrl);
    url.searchParams.set("subscribe_to", feedUrl);
    return url;
  },
  newTab: noopOpener,
  tinyTinyRss(feedUrl, settingsState) {
    const url = new URL("public.php", settingsState.tinyTinyRssUrl);
    url.searchParams.set("op", "bookmarklets--subscribe");
    url.searchParams.set("feed_url", feedUrl);
    return url;
  },
};

export function generateFeedUrl(
  settingsState: ISettings,
  feedUrl: string,
): URL {
  const opener = serviceUrlGenerators[settingsState.defaultOpener];
  return opener(feedUrl, settingsState);
}
