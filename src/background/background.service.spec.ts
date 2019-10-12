import { NcMessageTypes } from '../shared/messenger';
import { NcBackgroundService } from './background.service';

// tslint:disable max-classes-er-file

describe('NcBackgroundService', () => {

  let service: NcBackgroundService;
  let mockBrowser: MockBrowser;

  beforeEach(() => {
    mockBrowser = new MockBrowser();
    service = new NcBackgroundService(
      mockBrowser as any as typeof browser,
    );
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  it('should init and listen to actions', () => {
    service.init();
    expect(mockBrowser.pageAction.onClicked.addListener).toHaveBeenCalled();
  });

  it('should destroy and cleanup', () => {
    service.init();
    expect(mockBrowser.pageAction.onClicked.addListener).toHaveBeenCalled();
    service.destroy();
    expect(mockBrowser.pageAction.onClicked.removeListener).toHaveBeenCalled();
  });

  it('should send PromptMultiplier message to tabs on PageAction', () => {
    let handler: any;
    mockBrowser.pageAction.onClicked.addListener.mockImplementation(h => handler = h);
    service.init();

    const mockTab = {
      id: 'test',
    };
    handler(mockTab);
    expect(mockBrowser.tabs.sendMessage).toHaveBeenCalledWith(mockTab.id, expect.objectContaining({
      type: NcMessageTypes.PromptMultiplier,
    }));
  });

});

class MockBrowser {
  pageAction = {
    onClicked: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  };
  tabs = {
    sendMessage: jest.fn(),
  };
}
