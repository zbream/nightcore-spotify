import { Observable } from 'rxjs';

export function fromWebExtEvent<T extends (...args: any) => any>(webExtEvent: WebExtEvent<T>): Observable<Parameters<T>> {
  return new Observable<Parameters<T>>(subscriber => {
    const handler = (...args: Parameters<T>) => void subscriber.next(args);
    // @ts-ignore
    webExtEvent.addListener(handler);
    // @ts-ignore
    return () => webExtEvent.removeListener(handler);
  });
}
