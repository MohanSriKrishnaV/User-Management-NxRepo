import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeatureUserList } from 'feature-user-list';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FeatureUserList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('user-management');
}
