import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary">
        <span>User Management System</span>
        <span class="toolbar-spacer"></span>
        <ng-container *ngIf="isAuthenticated">
          <span class="user-info">{{ currentUser?.username }}</span>
          <button mat-icon-button (click)="logout()" matTooltip="Logout">
            <mat-icon>exit_to_app</mat-icon>
          </button>
        </ng-container>
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
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    .user-info {
      margin-right: 16px;
      font-size: 14px;
    }
  `]
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      isAuthenticated => this.isAuthenticated = isAuthenticated
    );
    
    this.authService.currentUser$.subscribe(
      user => this.currentUser = user
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
