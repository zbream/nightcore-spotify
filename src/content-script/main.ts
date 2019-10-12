import { NcContentScriptService } from './content-script.service';

new NcContentScriptService(browser, window).init();

// https://stackoverflow.com/a/9517879
const injectUrl = browser.runtime.getURL('page-script/page-script.js');
const injectTag = document.createElement('script');
injectTag.src = injectUrl;
(document.head || document.documentElement).appendChild(injectTag);
injectTag.onload = () => void injectTag.remove();
