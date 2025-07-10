import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  const mockAuthService = {
  validateResetToken: jest.fn().mockReturnValue(of({ id: 1, email: 'test@example.com' })),
  resetPassword: jest.fn().mockReturnValue(of({ message: 'Mot de passe réinitialisé avec succès' }))
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  const mockActivatedRoute = {
    params: of({ token: 'mock-token' }) // Correction ici
  };



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: mockSnackBar }

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should validate reset token on init', () => {
    component.ngOnInit();

    expect(mockAuthService.validateResetToken).toHaveBeenCalledWith('mock-token');
    expect(component.isTokenValid).toBeTruthy();
    expect(component.user?.email).toBe('test@example.com');
  });
  it('should reset password successfully', () => {
    component.token = 'mock-token';
    component.formGroup.setValue({
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    });

    component.onSubmit();

    expect(mockAuthService.resetPassword).toHaveBeenCalledWith({
      token: 'mock-token',
      newPassword: 'newpass123'
    });

    expect(mockSnackBar.open).toHaveBeenCalledWith('Mot de passe réinitialisé avec succès', 'Fermer', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
  it('should show error when passwords do not match', () => {
    component.formGroup.setValue({
      newPassword: 'newpass123',
      confirmPassword: 'wrongpass'
    });

    component.onSubmit();

    expect(component.submitErrorMessage).toBe('');
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
