import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should be invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should be invalid when password is too short', () => {
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('12345'); // Less than 6 characters
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should be valid when all fields are filled correctly', () => {
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('password123');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should navigate to users page on successful login', () => {
    component.loginForm.controls['username'].setValue('admin');
    component.loginForm.controls['password'].setValue('password');
    
    authServiceSpy.login.and.returnValue(of(true));
    
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith('admin', 'password');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should show error message on failed login', () => {
    component.loginForm.controls['username'].setValue('wronguser');
    component.loginForm.controls['password'].setValue('wrongpass');
    
    authServiceSpy.login.and.returnValue(of(false));
    
    component.onSubmit();
    
    expect(component.loginError).toBeTruthy();
    expect(component.errorMessage).toBe('Invalid username or password');
  });

  it('should show error message on login error', () => {
    component.loginForm.controls['username'].setValue('admin');
    component.loginForm.controls['password'].setValue('password');
    
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Server error')));
    
    component.onSubmit();
    
    expect(component.loginError).toBeTruthy();
    expect(component.errorMessage).toBe('An error occurred during login. Please try again.');
  });
}); 