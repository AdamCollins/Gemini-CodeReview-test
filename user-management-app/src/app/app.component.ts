import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary">
        <span>User Management System</span>
      </mat-toolbar>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
    }
    mat-toolbar {
      margin-bottom: 20px;
    }
  `]
})
export class AppComponent {}
