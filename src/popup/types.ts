export interface Feed {
  type: string;
  extractType: "direct" | "derived";
  href: string;
  title: string;
}

export interface PageSyncResult {
  feeds: Feed[];
}

export type Browser = typeof browser | typeof chrome;

export type ThemeMode = "auto" | "light" | "dark";

export type KnownOpeners = "newTab" | "feedly" | "inoreader" | "tinyTinyRss" | "nextcloud" | "freshRss";

export type PageStateResult = {
  url: string;
  siteType: {
    isWordpressBased: boolean;
  };
};

export interface ISettings {
  themeMode: ThemeMode;
  defaultOpener: KnownOpeners;
  tinyTinyRssUrl?: string;
  nextcloudUrl?: string;
  freshRssUrl?: string;
  useOpenerLinksToCopy: boolean;
}

export interface IFeedExtractor {
  match(pageState: PageStateResult): boolean;
  getScriptPath(): string;
}

export type FeedResult =
  | { results: PageSyncResult; error?: undefined }
  | { results?: undefined; error: Error | string };
