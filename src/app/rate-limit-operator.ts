import {Observable} from 'rxjs';

/**
 * Custom RxJS operator that limits the rate at which values are emitted.
 * @param timoutOut - the timeout in milliseconds
 * @param callbackFn - optional callback function to be called after the timeout
 */
export const rateLimitTime = <T>(
  timoutOut: number,
  callbackFn?: () => void
): ((source: Observable<T>) => Observable<T>) => {
  let isRunning: number | null = null;

  return function (source: Observable<T>) {
    return new Observable<T>(observer => {
      return source.subscribe({
        next(value) {


          if (isRunning === null) {
            observer.next(value);
          } else {
            clearTimeout(isRunning);
          }

          // wait until the timeout is over
          // to allow more values to be sent
          isRunning = (<unknown>setTimeout(() => {
            isRunning = null;

            if (callbackFn) {
              callbackFn();
            }
          }, timoutOut)) as number;

        },
        error(error) {
          observer.error(error);
        },
        complete() {
          observer.complete();
        }
      });
    });
  };
};
