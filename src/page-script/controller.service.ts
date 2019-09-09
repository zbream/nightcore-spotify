export class NcControllerService {

  private _player?: HTMLMediaElement;
  private _multiplier = 1.0;

  constructor(
    private _document: Document,
  ) {}

  init() {
    const base = this._document.createElement;
    this._document.createElement = (tagName: string, options?: ElementCreationOptions) => {
      const element = base.call(this._document, tagName, options);
      if (['audio', 'video'].includes(tagName)) {
        this._player = element as HTMLMediaElement;
        this._updatePlayer();
      }
      return element;
    };
  }

  destroy() {}

  setMultiplier(multiplier: number) {
    this._multiplier = multiplier;
    this._updatePlayer();
  }

  private _updatePlayer() {
    if (!this._player) {
      return;
    }
    this._player.playbackRate = this._multiplier;
    this._player.defaultPlaybackRate = this._multiplier;
    // disable pitch shift
    this._player.mozPreservesPitch = false;
  }

}
