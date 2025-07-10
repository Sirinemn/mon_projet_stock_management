import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RegisterComponent } from './register.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;
  let mockRouter: any = { events: { subscribe: jest.fn() }, createUrlTree: jest.fn(), serializeUrl: jest.fn() };
  let mockSnackBar = { open: jest.fn() };

  beforeEach(async () => {
    mockAuthService = {
      registerAdmin: jest.fn().mockReturnValue(of({ message: 'Registration successful' }))
    };
    const mockActivatedRoute = {
      snapshot: { paramMap: { get: jest.fn().mockReturnValue('mockValue') } }
    };
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNativeDateAdapter(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have invalid form when fields are empty', () => {
    component.formGroup.setValue({ email: '', password: '', firstname: '', lastname: '', groupName: '', dateOfBirth: '' });
    expect(component.formGroup.valid).toBeFalsy();
  });
  it('should register and navigate on success', () => {
    jest.spyOn(mockAuthService, 'registerAdmin').mockReturnValue(of({ message: 'Registration successful' }));
    const snackBarSpy = jest.spyOn(mockSnackBar, 'open');

    component.formGroup.setValue({
      email: 'test@example.com',
      password: 'password',
      firstname: 'Test',
      lastname: 'User',
      groupName: 'GroupTest',
      dateOfBirth: '2023-01-01'
    });
    component.Submit();

    expect(mockAuthService.registerAdmin).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalledWith('Registration successful', 'Fermer', { duration: 3000 });
  });
  it('should unsubscribe on destroy', () => {
    const spy = jest.spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
