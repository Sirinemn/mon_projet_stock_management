import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [MatProgressSpinnerModule, MatIconModule ,MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnDestroy{
  public formGroup: FormGroup;
  public errorMessage: string = '';
  public isLoading: boolean = false;
  public destroy$ = new Subject<void>();

  public constructor(
    private formBuiler: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ){
    this.formGroup = formBuiler.group({
      email: ['', [Validators.required, Validators.email]],  
    })
  }
  public Submit():void {
    if(this.formGroup.valid) {
      this.isLoading = true;
      const email = this.formGroup.value;
      this.authService.sendResetPasswordEmail(email).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response)=> {
          this.isLoading = false;
          this.snackBar.open(response.message, 'Fermer', {
              duration: 3000, 
            });
          this.router.navigate(['']);
        },
        error: (error)=> {
          this.isLoading = false;
          this.errorMessage = error.message?? 'Une erreur est survenue';
        }
      });
    } else this.errorMessage = "Le formulaire n'est pas valide";
  }
  public back() {
    window.history.back();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
