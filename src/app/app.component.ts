import { Component, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { fromEvent, debounceTime, Subject } from 'rxjs';
import { scan, tap, throttleTime } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

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
  
  debounceTimeClickCount: WritableSignal<number> = signal(0);
  throttleTimeClickCount: WritableSignal<number> = signal(0);

  delay = 2000;

  debounceTimeResult = toSignal(this.debounceTime$.pipe(
    scan((count,_) => count + 1, 0),
    tap((count: number) => this.debounceTimeClickCount.set(count)),
    debounceTime(this.delay),
    scan((acc,count) => {
      if (acc.length > 0) {
        return `${acc}, ${count}`;
      }
      return `${count}`;
    }, ''),
   )
  );



  throttleTimeResult = toSignal(this.throttleTime$.pipe(
    scan((count,_) => count + 1, 0),
    tap((count: number) => this.throttleTimeClickCount.set(count)),
    throttleTime(this.delay),
    scan((acc,count) => {
      if (acc.length > 0) {
        return `${acc}, ${count}`;
      }
      return `${count}`;
    }, ''),
   )
  );

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


}
