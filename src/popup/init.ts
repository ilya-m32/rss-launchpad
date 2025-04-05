import type { FeedListComponent } from "./components/feed.js";
import type { ISettings, Feed, FeedResult } from "./types";
import type { FailedStateComponent } from "./components/failed.js";
import { settings } from "./settings/index.js";
import { getBrowser, sanitizeFeeds } from "./utils.js";
import { getPageFeeds } from "./extractors/index.js";

// Reference in runtime to register components
import "./components/index.js";

// Init
initExtension();

function initExtension() {
  const browserObj = getBrowser();

  // once during start-up
  onGlobalSettingsUpdate(settings.toJSON());
  settings.subscribe(onGlobalSettingsUpdate);

  return getPageFeeds(browserObj).then(onResultReceived);
}

function onResultReceived(
  payload: FeedResult
): void {
  const { results } = payload;

  let feeds: Feed[] = [];
  const contentElem = document.getElementById("content");
  if (!contentElem) {
    console.error("No content element to render");
    return;
  }

  if (!results) {
    const failedStateElem = document.createElement(
      "failed-state",
    ) as FailedStateComponent;
    failedStateElem.setReason(
      String(payload.error).includes("permission") ? "permission" : "other",
    );
    failedStateElem.onRefresh = () => void initExtension();
    contentElem.replaceChildren(failedStateElem);
    return;
  }

  const listElement = contentElem.querySelector("feed-list") as
    | FeedListComponent
    | undefined;

  if (results) {
    feeds = sanitizeFeeds(results.feeds);
  } else {
    console.error("No result returned from the page");
  }

  listElement?.setFeeds(feeds);
}

function onGlobalSettingsUpdate(state: ISettings) {
  document.querySelector("body")!.className =
    `theme theme-mode_${state.themeMode}`;
}
