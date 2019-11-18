import { createNcSetMultiplierMessage, isNcPromptMultiplierMessage, NcMessage } from '../shared/messenger';

export class NcContentScriptService {

  constructor(
    private _browser: typeof browser,
    private _window: Window,
  ) {}

  init() {
    this._browser.runtime.onMessage.addListener(message => {
      if (isNcPromptMultiplierMessage(message)) {
        this._onPromptMultiplierMessage();
      }
    });
  }

  private _onPromptMultiplierMessage() {
    const input = this._window.prompt('Nightcore Multiplier?');
    if (!input) {
      return;
    }
    const multiplier = parseFloat(input);
    if (isNaN(multiplier)) {
      return;
    }
    const message = createNcSetMultiplierMessage(multiplier);
    this._messagePageScript(message);
  }

  private _messagePageScript(message: NcMessage) {
    this._window.postMessage(message, '*');
  }

}
