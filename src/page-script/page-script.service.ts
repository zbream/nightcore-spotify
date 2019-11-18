import { isNcSetMultiplierMessage, NcSetMultiplierMessage } from '../shared/messenger';
import { NcControllerService } from './controller.service';

export class NcPageScriptService {

  constructor(
    private _window: Window,
    private _controller: NcControllerService,
  ) {}

  init() {
    this._window.addEventListener('message', ({ data: message }) => {
      if (isNcSetMultiplierMessage(message)) {
        this._onSetMultiplierMessage(message);
      }
    });
  }

  private _onSetMultiplierMessage(message: NcSetMultiplierMessage) {
    this._controller.setMultiplier(message.payload.multiplier);
  }

}
