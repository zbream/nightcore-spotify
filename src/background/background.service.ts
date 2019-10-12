import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { createNcPromptMultiplierMessage, NcMessage } from '../shared/messenger';
import { fromWebExtEvent } from '../shared/web-ext-event';

export class NcBackgroundService {

  private _subscriptions = new Subscription();

  constructor(
    private _browser: typeof browser,
  ) {}

  init() {
    this._subscriptions.add(
      fromWebExtEvent(this._browser.pageAction.onClicked).pipe(
        map(([tab]) => tab),
      ).subscribe(tab => void this._onPageAction(tab)),
    );
  }

  destroy() {
    this._subscriptions.unsubscribe();
  }

  private _onPageAction(tab: browser.tabs.Tab) {
    const message = createNcPromptMultiplierMessage();
    this._notifyContentScript(tab, message);
  }

  private _notifyContentScript(tab: browser.tabs.Tab, message: NcMessage) {
    this._browser.tabs.sendMessage(tab.id!, message);
  }

}
