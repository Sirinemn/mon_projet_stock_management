import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordComponent } from './change-password.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';
import { SessionService } from '../../../../core/services/session.service';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  const mockSessionService = {
    getUser: jest.fn().mockReturnValue({ email: 'test@example.com' })
  };

  const mockAuthStateService = {
    setFirstLogin: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };
  const mockAuthService = {
    changePassword: jest.fn().mockReturnValue(of({ message: 'Mot de passe changé avec succès' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should retrieve user on init and set first login status', () => {
    component.ngOnInit();

    expect(mockSessionService.getUser).toHaveBeenCalled();
    expect(mockAuthStateService.setFirstLogin).toHaveBeenCalledWith(false);
    expect(component.user?.email).toBe('test@example.com');
  });
  it('should change password successfully', () => {
    component.formGroup.setValue({
      currentPassword: 'current',
      newPassword: 'test123',
      confirmPassword: 'test123'
    });

    component.Submit();

    expect(mockAuthService.changePassword).toHaveBeenCalledWith({
      currentPassword: 'current',
      email: 'test@example.com',
      newPassword: 'test123'
    });

    expect(mockSnackBar.open).toHaveBeenCalledWith('Mot de passe changé avec succès', 'Fermer', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['features/dashboard']);
  });
  it('should show error when passwords do not match', () => {
    component.formGroup.setValue({
      currentPassword: 'current',
      newPassword: 'test123',
      confirmPassword: 'wrongpass'
    });

    component.Submit();

    expect(component.errorMessage).toBe('Les mots de passe ne correspondent pas');
  });
  it('should unsubscribe from httpSubscription on destroy', () => {
    component.httpSubscription = new Subscription();
    const spy = jest.spyOn(component.httpSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
