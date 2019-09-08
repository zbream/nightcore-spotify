import { NcControllerService } from './controller.service';
import { NcPageScriptService } from './page-script.service';

const controller = new NcControllerService(document);
controller.init();
window.nightcore = controller;

new NcPageScriptService(window, controller).init();
