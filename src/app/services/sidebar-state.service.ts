import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  private _open$ = new BehaviorSubject<boolean>(false);

  get open$(): Observable<boolean> {
    return this._open$.asObservable();
  }

  isOpen(): boolean {
    return this._open$.getValue();
  }

  open() {
    this._open$.next(true);
  }

  close() {
    this._open$.next(false);
  }

  toggle() {
    this._open$.next(!this._open$.getValue());
  }
}
