import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models/user';
import { ResetPasswordConfirmRequest } from '../../models/reset-password-request';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnDestroy, OnInit{
  public formGroup: FormGroup;
  public token: string = '';
  public isLoading = false;
  public isSubmitting = false;
  public successMessage = '';
  public errorMessage = '';
  public submitErrorMessage = '';
  public isTokenValid: boolean = false;
  public destroy$ = new Subject<void>();
  public user?: User;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token']?? '';
    });
    
    if (this.token) {
      this.isLoading = true;
      this.authService.validateResetToken(this.token)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user) => {
            this.isLoading = false;
            this.isTokenValid = true;
            this.user = user;
          },
          error: (error) => {
            this.isLoading = false;
            this.isTokenValid = false;
            this.errorMessage = error.error?.message?? 'Le lien est invalide ou a expiré.';
          }
        });
    } else {
      this.isTokenValid = false;
      this.errorMessage = 'Aucun token fourni.';
    }
  }

  public onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submitErrorMessage = '';
    
    const { newPassword } = this.formGroup.value;

    const resetRequest: ResetPasswordConfirmRequest = {
      token: this.token,
      newPassword: newPassword
    };

    this.authService.resetPassword(resetRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.router.navigate(['/auth/login']);
          this.snackBar.open(response.message, 'Fermer', {duration: 3000})
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitErrorMessage = error.error?.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.';
        }
      });
  }
  private passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
