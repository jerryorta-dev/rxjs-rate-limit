import {rateLimitTime} from './rate-limit-operator';
import {Component, signal, WritableSignal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {debounceTime, Subject} from 'rxjs';
import {scan, tap, throttleTime} from 'rxjs/operators';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  debounceTime$: Subject<void> = new Subject();
  throttleTime$: Subject<void> = new Subject();
  rateLimitTime$: Subject<void> = new Subject();
  rateLimitTimeDisable$: Subject<void> = new Subject();

  debounceTimeClickCount: WritableSignal<number> = signal(0);
  throttleTimeClickCount: WritableSignal<number> = signal(0);
  rateLimitTimeClickCount: WritableSignal<number> = signal(0);
  rateLimitTimeDisableClickCount: WritableSignal<number> = signal(0);

  delay = 2000;

  debounceTimeResult = toSignal(
    this.debounceTime$.pipe(
      scan((count, _) => count + 1, 0),
      tap((count: number) => this.debounceTimeClickCount.set(count)),

      // Debounce the click events
      debounceTime(this.delay),

      // Track the number of values emitted
      scan((acc, count) => {
        if (acc.length > 0) {
          return `${acc}, ${count}`;
        }
        return `${count}`;
      }, '')
    )
  );

  throttleTimeResult = toSignal(
    this.throttleTime$.pipe(
      scan((count, _) => count + 1, 0),
      tap((count: number) => this.throttleTimeClickCount.set(count)),

      // Throttle the click events
      throttleTime(this.delay),

      // Track the number of values emitted
      scan((acc, count) => {
        if (acc.length > 0) {
          return `${acc}, ${count}`;
        }
        return `${count}`;
      }, '')
    )
  );

  rateLimitResult = toSignal(
    this.rateLimitTime$.pipe(
      scan((count, _) => count + 1, 0),
      tap((count: number) => {
        this.rateLimitRunning.set(true);
        this.rateLimitTimeClickCount.set(count);
      }),

      // Rate limit time the click events
      rateLimitTime(this.delay, () => {
        this.rateLimitRunning.set(false);
      }),

      // Track the number of values emitted
      scan((acc, count) => {
        if (acc.length > 0) {
          return `${acc}, ${count}`;
        }
        return `${count}`;
      }, '')
    )
  );

  rateLimitTimeDisableResult = toSignal(
    this.rateLimitTimeDisable$.pipe(
      scan((count, _) => count + 1, 0),
      tap((count: number) => {
        this.rateLimitTimeDisableRunning.set(true);
        this.rateLimitTimeDisableClickCount.set(count);
      }),

      // Rate limit time the click events
      rateLimitTime(this.delay, () => {
        this.rateLimitTimeDisableRunning.set(false);
      }),

      // Track the number of values emitted
      scan((acc, count) => {
        if (acc.length > 0) {
          return `${acc}, ${count}`;
        }
        return `${count}`;
      }, '')
    )
  );

  // Track debounceTime and throttleTime results
  debounceTimeState: WritableSignal<string> = signal('');
  debounceTimeTimer: any | null = null;

  debounceTimeStart() {
    this.debounceTimeState.set('Started');

    if (this.debounceTimeTimer) {
      clearTimeout(this.debounceTimeTimer);
    }

    this.debounceTimeTimer = setTimeout(() => {
      this.debounceTimeState.set('Finished');
    }, this.delay);
  }

  // Track throttleTime results
  throttleTimeState: WritableSignal<string> = signal('');
  throttleTimeTimer: any | null = null;

  throttleTimeStart() {
    this.throttleTimeState.set('Started');

    if (this.throttleTimeTimer) {
      clearTimeout(this.throttleTimeTimer);
    }

    this.throttleTimeTimer = setTimeout(() => {
      this.throttleTimeState.set('Finished');
    }, this.delay);
  }

  // Track rateLimit results
  rateLimitRunning: WritableSignal<boolean> = signal(false);

  // With Disabled callback function
  rateLimitTimeDisableRunning: WritableSignal<boolean> = signal(false);
}
