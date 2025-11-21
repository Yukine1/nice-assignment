import { Component, signal } from '@angular/core';
import { AccountPageComponent } from './features/account/pages/account-page/account-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccountPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-project-nice');
}
