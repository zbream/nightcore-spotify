import { createNcPromptMultiplierMessage, NcMessageTypes } from '../shared/messenger';
import { NcContentScriptService } from './content-script.service';

// tslint:disable max-classes-per-file

describe('NcContentScriptService', () => {

  let service: NcContentScriptService;
  let mockBrowser: MockBrowser;
  let mockWindow: MockWindow;

  beforeEach(() => {
    mockBrowser = new MockBrowser();
    mockWindow = new MockWindow();
    service = new NcContentScriptService(
      mockBrowser as any as typeof browser,
      mockWindow as any as Window,
    );
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  it('should init and listen to messages', () => {
    service.init();
    expect(mockBrowser.runtime.onMessage.addListener).toHaveBeenCalled();
  });

  describe('Messaging', () => {

    let handler: (...params: any[]) => any;

    beforeEach(() => {
      mockBrowser.runtime.onMessage.addListener.mockImplementation(h => handler = h);
      service.init();
    });

    it('should listen for PromptMultiplier messages', () => {
      mockWindow.prompt.mockReturnValue(undefined);

      const mockMessage = createNcPromptMultiplierMessage();
      handler(mockMessage);
      expect(mockWindow.prompt).toHaveBeenCalled();
    });

    it('should ignore non-PromptMultiplier messages', () => {
      mockWindow.prompt.mockReturnValue(undefined);

      const mockMessage = {};
      handler(mockMessage);
      expect(mockWindow.prompt).not.toHaveBeenCalled();
    });

    it('should send SetMultiplier message to page after prompt', () => {
      mockWindow.prompt.mockReturnValue(1.5);

      const mockMessage = createNcPromptMultiplierMessage();
      handler(mockMessage);
      expect(mockWindow.postMessage).toHaveBeenCalledWith(expect.objectContaining({
        type: NcMessageTypes.SetMultiplier,
        payload: {
          multiplier: 1.5,
        },
      }), '*');
    });

    it('should ignore invalid multipliers', () => {
      const mockMessage = createNcPromptMultiplierMessage();

      mockWindow.postMessage.mockReset();
      mockWindow.prompt.mockReturnValueOnce('invalid');
      handler(mockMessage);
      expect(mockWindow.postMessage).not.toHaveBeenCalled();

      mockWindow.postMessage.mockReset();
      mockWindow.prompt.mockReturnValueOnce('1.5');
      handler(mockMessage);
      expect(mockWindow.postMessage).toHaveBeenCalled();
    });

  });

});

class MockBrowser {
  runtime = {
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  };
}

class MockWindow {
  prompt = jest.fn();
  postMessage = jest.fn();
}
