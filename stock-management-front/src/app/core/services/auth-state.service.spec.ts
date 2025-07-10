import { TestBed } from '@angular/core/testing';

import { AuthStateService } from './auth-state.service';

describe('AuthStateService', () => {
  let service: AuthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should initialize with default values', () => {
    expect(service.userRole).toEqual([]);
    service.getFirstLogin().subscribe(value => expect(value).toBeFalsy());
    service.getIsAdmin().subscribe(value => expect(value).toBeFalsy());
  });
  it('should update and retrieve first login status', () => {
    service.setFirstLogin(true);
    service.getFirstLogin().subscribe(value => expect(value).toBeTruthy());

    service.setFirstLogin(false);
    service.getFirstLogin().subscribe(value => expect(value).toBeFalsy());
  });
  it('should update and retrieve admin status', () => {
    service.setIsAdmin(true);
    service.getIsAdmin().subscribe(value => expect(value).toBeTruthy());

    service.setIsAdmin(false);
    service.getIsAdmin().subscribe(value => expect(value).toBeFalsy());
  });
  it('should return true if userRole contains ADMIN', () => {
    service.userRole = ['USER', 'ADMIN'];
    expect(service.isAdmin()).toBeTruthy();
  });

  it('should return false if userRole does not contain ADMIN', () => {
    service.userRole = ['USER'];
    expect(service.isAdmin()).toBeFalsy();
  });
  it('should return true if userRole contains MONITORING', () => {
    service.userRole = ['USER', 'MONITORING'];
    service.setIsMonitoring(true);
    service.getIsMonitoring().subscribe(value => expect(value).toBeTruthy());
  });
  it('should return false if userRole does not contain MONITORING', () => {
    service.userRole = ['USER'];
    service.setIsMonitoring(false);
    service.getIsMonitoring().subscribe(value => expect(value).toBeFalsy());
  });
});
