import { settings } from "../settings/index.js";
import type { ISettings, ThemeMode } from "../types";
import { createByTemplate } from "../utils.js";

const SELECT_FIELDS = ["themeMode", "defaultOpener"] as const;
const INPUT_FIELDS = ["tinyTinyRssUrl", "nextcloudUrl", "freshRssUrl"] as const;
const OPTION_TO_URL_NAME = {
  tinyTinyRss: "tinyTinyRssUrl",
  nextcloud: "nextcloudUrl",
  freshRss: "freshRssUrl",
} as const;
const URL_NAME_TO_OPTION = Object.fromEntries(
  Object.entries(OPTION_TO_URL_NAME).map(([k, v]) => [v, k]),
);

class SettingsMenuImpl extends HTMLElement {
  private dialog: HTMLDialogElement | undefined;
  private settings = settings;

  onConnect = () => {
    const settingsState = this.settings.toJSON();

    this.render(settingsState);
    const dialog = this.querySelector("dialog");
    if (!dialog) {
      throw Error("no dialog element in the tree of settings");
    }

    this.dialog = dialog;
    this.attachEventListeners();
  };

  connectedCallback() {
    this.settings.subscribe(this.onConnect);
    this.onConnect();
  }

  disconnectedCallback() {
    this.settings.unsubscribe(this.onConnect);
  }

  private attachEventListeners() {
    this.querySelector(".settings__button")!.addEventListener(
      "click",
      this.openDialog.bind(this),
    );
    this.querySelector(".settings__close-button")!.addEventListener(
      "click",
      this.closeDialog.bind(this),
    );
    this.querySelector(".settings__form")!.addEventListener(
      "formdata",
      this.onSubmit,
    );
    this.querySelector(".settings__urls")!.addEventListener(
      "change",
      this.onUrlUpdate,
    );
  }

  private onSubmit = (event: Event) => {
    const { formData } = event as FormDataEvent;
    event.preventDefault();

    // a bit ugly but should be good for now
    const themeMode = (formData.get("themeMode") ?? "auto") as ThemeMode;
    const defaultOpener = (formData.get("defaultOpener") ??
      "newTab") as ISettings["defaultOpener"];

    const inputUpdates = Object.fromEntries(
      INPUT_FIELDS.map((key) => [key, formData.get(key)]).filter(
        (pair) => pair[1],
      ),
    ) as ISettings;

    this.settings
      .setSetting({ ...inputUpdates, themeMode, defaultOpener })
      .then(
        () => void this.closeDialog(),
        () => {
          console.error("Could not save settings");
          // todo: replace with notifications later
          alert("Could not save settings");
        },
      );
  };

  openDialog() {
    if (this.dialog) {
      this.dialog.showModal();
    }
  }

  closeDialog() {
    if (this.dialog && this.dialog.open) {
      this.dialog.close();
    }
  }

  private onUrlUpdate = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const optionName = URL_NAME_TO_OPTION[target.name];
    const hasValidUrl = URL.canParse(target.value ?? "");

    if (!optionName) {
      return;
    }

    const optionElem = this.querySelector<HTMLOptionElement>(
      `option[name="${optionName}"]`,
    );
    if (optionElem) {
      const invalidUrl = !hasValidUrl;
      optionElem.disabled = invalidUrl;
      if (invalidUrl) {
        optionElem.selected = false;
      }
    }
  };

  private updateOpenerOptions(settingsState: ISettings) {
    // Enable openers if filled correctly
    for (const [option, urlKey] of Object.entries(OPTION_TO_URL_NAME)) {
      const optionElem = this.querySelector<HTMLOptionElement>(
        `option[name="${option}"][disabled]`,
      );

      if (optionElem && settingsState[urlKey]) {
        optionElem.disabled = false;
      }
    }
  }

  private updateSelectedElements(settingsState: ISettings) {
    for (const field of SELECT_FIELDS) {
      const selectElement = this.querySelector<HTMLSelectElement>(
        `select[name="${field}"]`,
      );
      const optionElement = selectElement?.options.namedItem(
        settingsState[field],
      );

      if (optionElement) {
        optionElement.selected = true;
      }
    }

    for (const field of INPUT_FIELDS) {
      const input = this.querySelector<HTMLSelectElement>(
        `input[name="${field}"]`,
      );
      if (input && settingsState[field]) {
        input.value = settingsState[field];
      }
    }
  }

  render(settingsState: ISettings) {
    this.replaceChildren(createByTemplate("template-settings"));

    this.updateOpenerOptions(settingsState);
    this.updateSelectedElements(settingsState);
  }
}

export type SettingsMenu = SettingsMenuImpl;

customElements.define("settings-menu", SettingsMenuImpl);
