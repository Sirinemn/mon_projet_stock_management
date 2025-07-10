import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';
import { User } from '../../auth/models/user';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should initialize with default values', () => {
    expect(service.isLogged).toBeFalsy();
    expect(service.getUser()).toBeUndefined();
    expect(service.getUserRole()).toBeUndefined();
    service.isLogged$().subscribe(value => expect(value).toBeFalsy());
  });
  it('should log in a user and update state', () => {
    const mockUser: User = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', dateOfBirth: '1990-01-01', groupId: 456, roles: ['ADMIN'], groupName: 'Group A', createdBy: 1, createdDate: '2023-01-01', lastModifiedDate: '2023-01-02' };
    
    service.logIn(mockUser);

    expect(service.isLogged).toBeTruthy();
    expect(service.getUser()).toEqual(mockUser);
    expect(service.getUserRole()).toEqual(['ADMIN']);
  });
  it('should log out user and reset state', () => {
    service.logOut();

    expect(service.isLogged).toBeFalsy();
    expect(service.getUser()).toBeUndefined();
  });
  it('should emit login status correctly', done => {
    service.isLogged$().subscribe(value => {
      expect(value).toBeFalsy();
      done();
    });
  });
  it('should emit user data correctly', done => {
    const mockUser: User = { id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', dateOfBirth: '1990-01-01', groupId: 456, roles: ['ADMIN'], groupName: 'Group A', createdBy: 1, createdDate: '2023-01-01', lastModifiedDate: '2023-01-02' };

    service.logIn(mockUser);
    service.getUser$().subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });
  });
});
