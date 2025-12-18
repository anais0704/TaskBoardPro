import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationSubject = new Subject<string>();
  readonly notifications$ = this.notificationSubject.asObservable();

  show(message: string, durationMs: number = 3000): void {
    if (!message) {
      return;
    }

    this.notificationSubject.next(message);

    if (durationMs > 0) {
      setTimeout(() => this.notificationSubject.next(''), durationMs);
    }
  }
}


