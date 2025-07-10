import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  const mockAuthService = {
    sendResetPasswordEmail: jest.fn().mockReturnValue(of({ message: 'E-mail de réinitialisation envoyé avec succès' }))
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }

      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should send reset password email successfully', () => {
    component.formGroup.setValue({
      email: 'test@example.com'
    });

    component.Submit();

    expect(mockAuthService.sendResetPasswordEmail).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockSnackBar.open).toHaveBeenCalledWith('E-mail de réinitialisation envoyé avec succès', 'Fermer', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
  it('should not send email when form is invalid', () => {
    component.formGroup.setValue({ email: '' });

    component.Submit();

    expect(component.errorMessage).toBe("Le formulaire n'est pas valide");
  });
  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component.destroy$, 'next');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
