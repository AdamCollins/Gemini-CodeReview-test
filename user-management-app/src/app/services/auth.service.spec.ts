import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // Create spy for localStorage
    localStorageSpy = jasmine.createSpyObj('Storage', ['getItem', 'setItem', 'removeItem']);
    spyOn(window, 'localStorage').and.returnValue(localStorageSpy);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with no user if localStorage is empty', () => {
    localStorageSpy.getItem.and.returnValue(null);
    service = TestBed.inject(AuthService);
    
    service.isAuthenticated$.subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeFalse();
    });
    
    service.currentUser$.subscribe(user => {
      expect(user).toBeNull();
    });
  });

  it('should initialize with user from localStorage if available', () => {
    const mockUser = { username: 'testuser', role: 'admin' };
    localStorageSpy.getItem.and.returnValue(JSON.stringify(mockUser));
    service = TestBed.inject(AuthService);
    
    service.isAuthenticated$.subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeTrue();
    });
    
    service.currentUser$.subscribe(user => {
      expect(user).toEqual(mockUser);
    });
  });

  it('should login successfully with correct credentials', (done) => {
    service.login('admin', 'password').subscribe(success => {
      expect(success).toBeTrue();
      expect(localStorageSpy.setItem).toHaveBeenCalled();
      
      service.isAuthenticated$.subscribe(isAuthenticated => {
        expect(isAuthenticated).toBeTrue();
      });
      
      service.currentUser$.subscribe(user => {
        expect(user).toEqual({ username: 'admin', role: 'admin' });
        done();
      });
    });
  });

  it('should fail login with incorrect credentials', (done) => {
    service.login('wronguser', 'wrongpass').subscribe(success => {
      expect(success).toBeFalse();
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
      
      service.isAuthenticated$.subscribe(isAuthenticated => {
        expect(isAuthenticated).toBeFalse();
      });
      
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  it('should logout correctly', () => {
    // First login
    service.login('admin', 'password').subscribe(() => {
      // Then logout
      service.logout();
      
      expect(localStorageSpy.removeItem).toHaveBeenCalled();
      
      service.isAuthenticated$.subscribe(isAuthenticated => {
        expect(isAuthenticated).toBeFalse();
      });
      
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });

  it('should return correct authentication state', () => {
    // Initially not authenticated
    expect(service.isAuthenticated()).toBeFalse();
    
    // Login
    service.login('admin', 'password').subscribe(() => {
      expect(service.isAuthenticated()).toBeTrue();
      
      // Logout
      service.logout();
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  it('should return current user', () => {
    // Initially no user
    expect(service.getCurrentUser()).toBeNull();
    
    // Login
    service.login('admin', 'password').subscribe(() => {
      expect(service.getCurrentUser()).toEqual({ username: 'admin', role: 'admin' });
      
      // Logout
      service.logout();
      expect(service.getCurrentUser()).toBeNull();
    });
  });
}); 