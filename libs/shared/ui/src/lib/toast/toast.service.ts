import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error';

export interface ToastMessage {
  message: string;
  kind: ToastKind;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toast = signal<ToastMessage | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  show(message: string, kind: ToastKind = 'success'): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.toast.set({ message, kind });
    this.timeoutId = setTimeout(() => this.clear(), 4000);
  }

  clear(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.toast.set(null);
  }
}