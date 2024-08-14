# rateLimitTime Operator

The custom rateLimitTime operator emits a notification from the source Observable immediately, then
**ignores** subsequent source values for duration milliseconds. The **timer resets**
after each emission. Only after the timer is up, the process repeats.

The second parameter is an optional callback function may that is called once the timer is up.

```typescript
    rateLimitTime(duration: number, callbackFn?: () => void): ((source: Observable<T>) => Observable<T>)
```

### Usage

```typescript
someObservable$
  .pipe(
    rateLimitTime(2000, () => {
      console.log('done');
    })
  )
  .subscribe(() => {
    // only receives first item during duration
    // and after no emissions have emitted during duration
    // until timer is complete.
  });
```

### References

- [RxJS: Rate Limiting and the Quest for the Perfect Throttle](https://medium.com/@jan.benscheid/rxjs-rate-limiting-and-the-quest-for-the-perfect-throttle-836612c88eb7)
- [throttleTime](https://rxjs.dev/api/index/function/throttleTime)
- [debounceTime](https://rxjs.dev/api/index/function/debounceTime)
