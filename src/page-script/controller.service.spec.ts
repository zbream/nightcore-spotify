import { NcControllerService } from './controller.service';

// tslint:disable max-classes-per-file

describe('NcControllerService', () => {

  let service: NcControllerService;
  let mockDocument: MockDocument;

  beforeEach(() => {
    mockDocument = new MockDocument();
    service = new NcControllerService(
      mockDocument as any as Document,
    );
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  it('should init and patch createElement', () => {
    expect(mockDocument.createElement).toBe(mockDocument.mockCreateElement);
    service.init();
    expect(mockDocument.createElement).not.toBe(mockDocument.mockCreateElement);
  });

  it('should set audio player with no-op multiplier', () => {
    service.init();

    mockDocument.createElement('audio');
    expect(mockDocument.mockCreatedElement).toEqual(expect.objectContaining({
      tag: 'audio',
      playbackRate: 1.0,
      defaultPlaybackRate: 1.0,
    }));
  });

  it('should set video player with no-op multiplier', () => {
    service.init();

    mockDocument.createElement('video');
    expect(mockDocument.mockCreatedElement).toEqual(expect.objectContaining({
      tag: 'video',
      playbackRate: 1.0,
      defaultPlaybackRate: 1.0,
    }));
  });

  it('should ignore non-media elements', () => {
    service.init();

    mockDocument.createElement('div');
    expect(mockDocument.mockCreatedElement).toEqual(expect.objectContaining({
      tag: 'div',
    }));
    expect(mockDocument.mockCreatedElement).not.toEqual(expect.objectContaining({
      playbackRate: 1.0,
      defaultPlaybackRate: 1.0,
    }));
  });

  it('should set multiplier on existing player', () => {
    service.init();

    mockDocument.createElement('audio');
    const player = mockDocument.mockCreatedElement!;

    expect(player).toEqual(expect.objectContaining({
      tag: 'audio',
      playbackRate: 1.0,
      defaultPlaybackRate: 1.0,
    }));

    service.setMultiplier(1.5);
    expect(player).toEqual(expect.objectContaining({
      tag: 'audio',
      playbackRate: 1.5,
      defaultPlaybackRate: 1.5,
    }));
  });

  it('should set multiplier on new player', () => {
    service.init();

    service.setMultiplier(1.5);

    mockDocument.createElement('audio');
    const player = mockDocument.mockCreatedElement!;

    expect(player).toEqual(expect.objectContaining({
      tag: 'audio',
      playbackRate: 1.5,
      defaultPlaybackRate: 1.5,
    }));
  });

});

class MockDocument {

  createElement = this.mockCreateElement;

  mockCreatedElement?: { tag: string };
  mockCreateElement(tag: string) {
    this.mockCreatedElement = { tag };
    return this.mockCreatedElement;
  }

}
