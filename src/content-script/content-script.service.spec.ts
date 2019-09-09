import { createNcPromptMultiplierMessage, createNcSetMultiplierMessage, NcMessageTypes } from '../shared/messenger';
import { NcContentScriptService } from './content-script.service';

describe('NcContentScriptService', () => {

  let service: NcContentScriptService;
  let mockWindow: MockWindow;

  beforeEach(() => {
    mockWindow = new MockWindow();
    service = new NcContentScriptService(
      mockWindow as any as Window,
    );
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  it('should init and listen to messages', () => {
    service.init();
    expect(mockWindow.browser.runtime.onMessage.addListener).toHaveBeenCalled();
  });

  it('should destroy and cleanup', () => {
    service.init();
    expect(mockWindow.browser.runtime.onMessage.addListener).toHaveBeenCalled();
    service.destroy();
    expect(mockWindow.browser.runtime.onMessage.removeListener).toHaveBeenCalled();
  });

  describe('Messaging', () => {

    let handler: (...params: any[]) => any;

    beforeEach(() => {
      mockWindow.browser.runtime.onMessage.addListener.mockImplementation(h => handler = h);
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

class MockWindow {

  browser = {
    runtime: {
      onMessage: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    },
  };

  prompt = jest.fn();

  postMessage = jest.fn();

}
