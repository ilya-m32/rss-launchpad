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

export interface ISettings {
  themeMode: ThemeMode;
  defaultOpener: "newTab";
}
