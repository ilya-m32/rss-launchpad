import type { Browser, ISettings } from "../types";

type OnChange = (settingsState: ISettings, update: Partial<ISettings>) => void;

export class Settings {
  private settings: ISettings = {
    themeMode: "auto",
    defaultOpener: "newTab",
    useOpenerLinksToCopy: false,
  };
  private inited = false;
  private subscribers: Set<OnChange> = new Set();

  constructor(private browser: Browser) {}

  private invariantInit() {
    if (!this.inited) {
      throw Error("Class wasn't initalized properly");
    }
  }

  init(): Promise<Settings> {
    if (this.inited) {
      return Promise.resolve(this);
    }

    return this.browser.storage.local
      .get(this.settings)
      .then((result) => {
        this.inited = true;
        this.settings = { ...this.settings, ...result };
        return this;
      })
      .catch((error) => {
        console.error("Error retrieving settings from storage:", error);
        return Promise.reject(error);
      });
  }

  getSetting<K extends keyof ISettings>(key: K) {
    this.invariantInit();

    return this.settings[key];
  }

  /**
   * Only subscribes one function once
   */
  subscribe(fn: OnChange) {
    this.subscribers.add(fn);
  }

  unsubscribe(fn: OnChange): boolean {
    return this.subscribers.delete(fn);
  }

  private updateSettingsState(update: Partial<ISettings>) {
    this.settings = { ...this.settings, ...update };
    this.subscribers.forEach((fn) => fn(this.settings, update));
  }

  setSetting(update: Partial<ISettings>): Promise<void> {
    // Save the setting to storage
    return this.browser.storage.local
      .set(update)
      .then(() => {
        this.updateSettingsState(update);
      })
      .catch((error) => {
        console.error(`Error saving ${JSON.stringify(update)} update to storage:`, error);
      });
  }

  toJSON(): ISettings {
    this.invariantInit();

    return structuredClone(this.settings);
  }
}
