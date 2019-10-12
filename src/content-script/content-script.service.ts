import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { createNcSetMultiplierMessage, isNcPromptMultiplierMessage, NcMessage } from '../shared/messenger';
import { fromWebExtEvent } from '../shared/web-ext-event';

export class NcContentScriptService {

  private _subscriptions = new Subscription();

  constructor(
    private _browser: typeof browser,
    private _window: Window,
  ) {}

  init() {
    this._subscriptions.add(
      fromWebExtEvent(this._browser.runtime.onMessage).pipe(
        map(([message]) => message),
        filter(isNcPromptMultiplierMessage),
      ).subscribe(() => void this._onPromptMultiplierMessage()),
    );
  }

  destroy() {
    this._subscriptions.unsubscribe();
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
    this._notifyPageScript(message);
  }

  private _notifyPageScript(message: NcMessage) {
    this._window.postMessage(message, '*');
  }

}
