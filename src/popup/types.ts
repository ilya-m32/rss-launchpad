export interface Feed {
  type: string;
  href: string;
  title: string;
}

export interface PageSyncResult {
  feeds: Feed[];
}

export type Browser = typeof browser | typeof chrome;

export type ThemeMode = "auto" | "light" | "dark";

export type KnownOpeners =
  | "newTab"
  | "feedly"
  | "inoreader"
  | "tinyTinyRss"
  | "nextcloud"
  | "freshRss";

export interface ISettings {
  themeMode: ThemeMode;
  defaultOpener: KnownOpeners;
  tinyTinyRssUrl?: string;
  nextcloudUrl?: string;
  freshRssUrl?: string;
}
