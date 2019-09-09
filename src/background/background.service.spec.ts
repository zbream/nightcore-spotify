import { NcMessageTypes } from '../shared/messenger';
import { NcBackgroundService } from './background.service';

describe('NcBackgroundService', () => {

  let service: NcBackgroundService;
  let mockWindow: MockWindow;

  beforeEach(() => {
    mockWindow = new MockWindow();
    service = new NcBackgroundService(
      mockWindow as any as Window,
    );
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  it('should init and listen to actions', () => {
    service.init();
    expect(mockWindow.browser.pageAction.onClicked.addListener).toHaveBeenCalled();
  });

  it('should destroy and cleanup', () => {
    service.init();
    expect(mockWindow.browser.pageAction.onClicked.addListener).toHaveBeenCalled();
    service.destroy();
    expect(mockWindow.browser.pageAction.onClicked.removeListener).toHaveBeenCalled();
  });

  it('should send PromptMultiplier message to tabs on PageAction', () => {
    let handler: any;
    mockWindow.browser.pageAction.onClicked.addListener.mockImplementation(h => handler = h);
    service.init();

    const mockTab = {
      id: 'test',
    };
    handler(mockTab);
    expect(mockWindow.browser.tabs.sendMessage).toHaveBeenCalledWith(mockTab.id, expect.objectContaining({
      type: NcMessageTypes.PromptMultiplier,
    }));
  });

});

class MockWindow {

  browser = {
    pageAction: {
      onClicked: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    },
    tabs: {
      sendMessage: jest.fn(),
    },
  };

}
