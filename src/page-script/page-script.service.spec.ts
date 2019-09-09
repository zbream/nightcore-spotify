import { createNcSetMultiplierMessage } from '../shared/messenger';
import { NcControllerService } from './controller.service';
import { NcPageScriptService } from './page-script.service';

// tslint:disable max-classes-per-file

describe('NcPageScriptService', () => {

  let service: NcPageScriptService;
  let mockWindow: MockWindow;
  let mockControllerService: MockControllerService;

  beforeEach(() => {
    mockWindow = new MockWindow();
    mockControllerService = new MockControllerService();
    service = new NcPageScriptService(
      mockWindow as any as Window,
      mockControllerService as any as NcControllerService,
    );
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  it('should init', () => {
    service.init();
    expect(mockWindow.addEventListener).toHaveBeenCalled();
  });

  it('should destroy', () => {
    service.init();
    expect(mockWindow.addEventListener).toHaveBeenCalled();
    service.destroy();
    expect(mockWindow.removeEventListener).toHaveBeenCalled();
  });

  describe('Messaging', () => {

    let handler: (...params: any[]) => any;

    beforeEach(() => {
      mockWindow.addEventListener.mockImplementation((t, h) => handler = h);
      service.init();
    });

    it('should listen for SetMultiplier messages', () => {
      const mockMessage = createNcSetMultiplierMessage(1.5);
      const mockEvent = {
        data: mockMessage,
      };
      handler(mockEvent);
      expect(mockControllerService.setMultiplier).toHaveBeenCalledWith(1.5);
    });

    it('should ignore non-SetMultiplier messages', () => {
      const mockMessage = {};
      const mockEvent = {
        data: mockMessage,
      };
      handler(mockEvent);
      expect(mockControllerService.setMultiplier).not.toHaveBeenCalled();
    });

  });

});

class MockWindow {

  addEventListener = jest.fn();
  removeEventListener = jest.fn();

}

class MockControllerService implements Partial<NcControllerService> {

  setMultiplier = jest.fn();

}
