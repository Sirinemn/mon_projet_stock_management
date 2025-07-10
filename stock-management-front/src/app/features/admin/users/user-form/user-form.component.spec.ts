import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormComponent } from './user-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { of, throwError } from 'rxjs';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
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
  let mockRouter: any = { events: { subscribe: jest.fn() }, createUrlTree: jest.fn(), serializeUrl: jest.fn(), navigate: jest.fn() };
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue(123) } }
  };
  const mockAuthService = {
    getUser: jest.fn().mockReturnValue(of(mockUser)) 
  };
  const mockAdminService = {
    getUser: jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnThis(),
      subscribe: jest.fn()
    }),
    updateUser: jest.fn().mockReturnValue(of({ message: 'User updated successfully' })),
  };
  const mockSnackBar = {
    open: jest.fn().mockReturnValue({
      afterDismissed: () => of({})
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: AdminService, useValue: mockAdminService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getUserById on init', () => {
    const getUserByIdSpy = jest.spyOn(component, 'getUserById');
    component.ngOnInit();
    expect(getUserByIdSpy).toHaveBeenCalledWith(123);
  });
  it('should have invalid form when required fields are missing', () => {
    component.formGroup.setValue({ email: '', lastname: '', firstname: '', dateOfBirth: '', password: '' });
    expect(component.formGroup.valid).toBeFalsy();
  });
  it('should update password validators in edit mode', () => {
    component.isEditMode = true;
    component.updatePasswordValidators();
    
    const passwordControl = component.formGroup.get('password');
    expect(passwordControl?.hasValidator(Validators.required)).toBeFalsy();
  });
  it('should display error message when getUser fails', () => {
    jest.spyOn(mockAuthService, 'getUser').mockReturnValue(throwError(() => ({ error: { message: 'User not found' } })));

    component.getUserById(123);
    
    expect(component.errorMessage).toBe('User not found');
  });
  it('should navigate to user list after successful update', () => {
    jest.spyOn(mockAdminService, 'updateUser').mockReturnValue(of({ message: 'User updated successfully' }));
    
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');
    
    component.formGroup.setValue({
      email: 'test@mail.fr',
      lastname: 'Doe',
      firstname: 'John',
      dateOfBirth: '1990-01-01',
      password: 'ValidPassword123!'
    });
    component.isEditMode = true; 
    
    component.updateUser();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/users']);
  }); 
});
