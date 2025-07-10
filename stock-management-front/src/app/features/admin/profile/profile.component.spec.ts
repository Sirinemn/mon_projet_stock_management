import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { SessionService } from '../../../core/services/session.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockUser = {
    id: 123,
    email: 'test@mail.fr',
    lastname: 'Doe',  
    firstname: 'John',
    dateOfBirth: '1990-01-01',
    createdDate: '2023-01-01',
    firstLogin: true,
    roles: ['user'],
    groupId: 1,
    createdBy: 1,
    groupName: 'group1',
    lastModifiedDate: '2023-01-01',
  }
  const mockRouter= {
    navigate: jest.fn()
  };
  const activateRouteMock = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue(1) } }
  };
  const mockAdminService = {
    updateUser: jest.fn().mockReturnValue(of({ message: 'User updated successfully' })),
    updateGroupName: jest.fn().mockReturnValue(of({ message: 'Group updated successfully' }))
  };

  const mockSessionService = {
    getUser$: jest.fn().mockReturnValue(of({ id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', dateOfBirth: '1990-01-01', groupName: 'Group A' })),
    updateUser: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn()
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [ProfileComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activateRouteMock },
        { provide: AdminService, useValue: mockAdminService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component.user = mockUser; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch user data and populate form', () => {
    component.getUser();

    expect(mockSessionService.getUser$).toHaveBeenCalled();
    expect(component.profileForm.value.firstname).toBe('John');
    expect(component.profileForm.value.lastname).toBe('Doe');
  });
  it('should update user profile successfully', () => {
    component.profileForm.setValue({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '1990-01-01',
      groupName: 'Group A'
    });

    component.onSubmit();

    expect(mockAdminService.updateUser).toHaveBeenCalledWith(1, expect.any(Object));
    expect(mockSnackBar.open).toHaveBeenCalledWith('Profil mis à jour avec succès', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
  });
  it('should update group name if changed', () => {
    component.profileForm.setValue({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '1990-01-01',
      groupName: 'New Group'
    });

    component.onSubmit();
    expect(mockAdminService.updateGroupName).toHaveBeenCalledWith(1, 'New Group');
  });
    it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
