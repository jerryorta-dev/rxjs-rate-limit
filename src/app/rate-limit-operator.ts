import {Observable} from 'rxjs';

/**
 * Custom RxJS operator that limits the rate at which values are emitted.
 * @param duration - the timeout in milliseconds
 * @param callbackFn - optional callback function to be called after the timeout
 */
export const rateLimitTime = <T>(
  duration: number,
  callbackFn?: () => void
): ((source: Observable<T>) => Observable<T>) => {
  let isRunning: number | null = null;

  return function (source: Observable<T>) {
    return new Observable<T>(observer => {
      return source.subscribe({
        next(value) {


          if (isRunning === null) {
            // If the timer is not running, emit the value
            observer.next(value);
          } else {
            // If the timer is running, new values
            // are ignored and the timer is reset
            clearTimeout(isRunning);
          }

          // Set the timer to ignore any new values
          // during the timeout period
          isRunning = (<unknown>setTimeout(() => {
            isRunning = null;

            if (callbackFn) {
              callbackFn();
            }
          }, duration)) as number;

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
