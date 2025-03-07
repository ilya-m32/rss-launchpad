import type { FeedListComponent } from "./components/feed.js";
import type { PageSyncResult, Browser, ISettings, Feed } from "./types";
import type { FailedStateComponent } from "./components/failed.js";
import { settings } from "./settings/index.js";
import { getBrowser, sanitizeFeeds } from "./utils.js";

// Reference in runtime to register components
import "./components/index.js";

// Init
initExtension();

function initExtension() {
  const browserObj = getBrowser();

  // once during start-up
  onGlobalSettingsUpdate(settings.toJSON());
  settings.subscribe(onGlobalSettingsUpdate);

  return executeActiveTab(browserObj, {
    file: "injectable/page-inject.js",
  }).then(onResultReceived);
}

function executeActiveTab(browserObj: Browser, opts: { file: string }) {
  return browserObj.tabs
    .executeScript(opts)
    .then((results) => {
      // This function is called after the script has been executed
      if (browserObj.runtime.lastError || !results || !results.length) {
        throw Error(String(browserObj.runtime.lastError));
      }

      return { results };
    })
    .catch((error) => {
      console.error("Error on script execution: ", error);
      return { error };
    });
}

function onResultReceived(
  payload:
    | { results: PageSyncResult[] }
    | { results?: undefined; error: Error | string },
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

  const [result] = results;
  if (result) {
    feeds = sanitizeFeeds(result.feeds);
  } else {
    console.error("No result returned from the page");
  }

  listElement?.setFeeds(feeds);
}

function onGlobalSettingsUpdate(state: ISettings) {
  document.querySelector("body")!.className =
    `theme theme-mode_${state.themeMode}`;
}
