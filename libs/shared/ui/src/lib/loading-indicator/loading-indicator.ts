import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-loading-indicator',
  standalone: true,
  template: `
    <div class="loading-indicator" role="status" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true"></span>
      <span>{{ label() }}</span>
    </div>
  `,
  styleUrl: './loading-indicator.scss',
})
export class LoadingIndicator {
  readonly label = input('Loading...');
}
