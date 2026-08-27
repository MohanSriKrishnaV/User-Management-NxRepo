import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeatureUserList } from 'feature-user-list';
import { Toast } from 'ui';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FeatureUserList, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('user-management');
}
