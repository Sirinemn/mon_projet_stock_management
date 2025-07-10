import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../auth/services/auth.service';
import { SessionService } from '../../../../core/services/session.service';
import { User } from '../../../../auth/models/user';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { ChangePasswordRequest } from '../../../../auth/models/ChangePasswordRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatProgressSpinner,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  public user?: User;
  public formGroup: FormGroup;
  public errorMessage: string = '';
  public isLoading: boolean = false;
  public httpSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private authStateService: AuthStateService,
    private formBuiler: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.formGroup = this.formBuiler.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
    this.authStateService.setFirstLogin(false);
  }
  public Submit() {
    if (this.formGroup.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const { currentPassword, newPassword, confirmPassword } = this.formGroup.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      this.isLoading = false;
      return;
    }
    if (currentPassword === newPassword) {
      this.errorMessage = 'Le nouveau mot de passe doit être différent de l\'ancien';
      this.isLoading = false;
      return;
    }

    const changePasswordRequest: ChangePasswordRequest = {
      email: this.user?.email || '',
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    this.httpSubscription = this.authService
      .changePassword(changePasswordRequest)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.authStateService.setFirstLogin(false);
          this.snackBar.open(response.message, 'Fermer', {
            duration: 3000,
          });
          this.router.navigate(['features/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error.message??'Une erreur est survenue lors de la modification du mot de passe.';
        },
      });
  }
  public back() {
    window.history.back();
  }
  ngOnDestroy(): void {
    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }
  }
}
