import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'lib-toast',
  standalone: true,
  template: `
    @if (toastService.toast(); as toast) {
      <div
        class="toast"
        [class.toast-error]="toast.kind === 'error'"
        [attr.role]="toast.kind === 'error' ? 'alert' : 'status'"
        aria-live="polite"
      >
        <span>{{ toast.message }}</span>
        <button type="button" aria-label="Dismiss notification" (click)="toastService.clear()">
          &#215;
        </button>
      </div>
    }
  `,
  styleUrl: './toast.scss',
})
export class Toast {
  readonly toastService = inject(ToastService);
}