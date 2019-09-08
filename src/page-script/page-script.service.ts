import { fromEvent, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { isNcSetMultiplierMessage, NcSetMultiplierMessage } from '../shared/messenger';
import { NcControllerService } from './controller.service';

export class NcPageScriptService {

  private _subscriptions = new Subscription();

  constructor(
    private _window: Window,
    private _controller: NcControllerService,
  ) {}

  init() {
    this._subscriptions.add(
      fromEvent<MessageEvent>(this._window, 'message').pipe(
        map(event => event.data),
        filter(isNcSetMultiplierMessage),
      ).subscribe(message => void this._onSetMultiplierMessage(message)),
    );
  }

  destroy() {
    this._subscriptions.unsubscribe();
  }

  private _onSetMultiplierMessage(message: NcSetMultiplierMessage) {
    this._controller.setMultiplier(message.payload.multiplier);
  }

}
