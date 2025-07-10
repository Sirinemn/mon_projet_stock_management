import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting() 
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call login API and return AuthResponse', () => {
    const mockResponse: AuthResponse = { token: 'mockToken', userId: 123, roles: ['user'], groupId: 456 };

    service.login({ email: 'test@example.com', password: 'password' }).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
  it('should retrieve user by ID', () => {
    const mockUser: User = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', dateOfBirth: '1990-01-01', groupId: 456, roles: ['user'], groupName: 'Group A', createdBy: 1, createdDate: '2023-01-01', lastModifiedDate: '2023-01-02' };

    service.getUser(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
  it('should clear token and navigate to login', () => {
    const navigateSpy = jest.spyOn(service['router'], 'navigate');
    localStorage.setItem('token', 'mockToken');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['auth/login']);
  });
  it('should return true if token exists', () => {
    localStorage.setItem('token', 'mockToken');
    expect(service.isAuthenticated()).toBeTruthy();
  });
  it('should return false if token does not exist', () => {
    localStorage.removeItem('token');
    expect(service.isAuthenticated()).toBeFalsy();
  });
});
