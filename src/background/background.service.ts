import { createNcPromptMultiplierMessage, NcMessage } from '../shared/messenger';

export class NcBackgroundService {

  constructor(
    private _browser: typeof browser,
  ) {}

  init() {
    this._browser.pageAction.onClicked.addListener(tab => {
      this._onPageAction(tab);
    });
  }

  private _onPageAction(tab: browser.tabs.Tab) {
    const message = createNcPromptMultiplierMessage();
    this._messageContentScript(tab, message);
  }

  private _messageContentScript(tab: browser.tabs.Tab, message: NcMessage) {
    this._browser.tabs.sendMessage(tab.id!, message);
  }

}
