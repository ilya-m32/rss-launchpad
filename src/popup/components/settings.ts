import { settings } from "../settings/index.js";
import type { ISettings, ThemeMode } from "../types";

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
  }

  private onSubmit = (event: Event) => {
    const { formData } = event as FormDataEvent;
    event.preventDefault();

    // a bit ugly but should be good for now
    const themeMode = (formData.get("themeMode") ?? "auto") as ThemeMode;

    this.settings.setSetting({ themeMode }).then(
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

  render(settingsState: ISettings) {
    const settingsTemplate = document.getElementById(
      "template-settings",
    ) as HTMLTemplateElement;

    this.replaceChildren(settingsTemplate.content.cloneNode(true));

    const themeSelect = this.querySelector(
      ".settings__theme-select",
    ) as HTMLSelectElement;
    const optionToSelect = themeSelect.options.namedItem(
      settingsState.themeMode,
    );
    if (optionToSelect) {
      optionToSelect.selected = true;
    }
  }
}

export type SettingsMenu = SettingsMenuImpl;

customElements.define("settings-menu", SettingsMenuImpl);
