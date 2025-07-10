import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';
import { RegisterUserRequest } from '../../../../auth/models/registerUserRequest';
import { provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../../../../auth/models/user';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-user-form',
  providers: [provideNativeDateAdapter()],
  imports: [MatProgressSpinnerModule ,MatCardModule, MatDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  public formGroup: FormGroup;
  public errorMessage: string = '';
  public messageResponse: string = '';
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;
  public isEditMode: boolean = false; 
  public userId: string | null = null; 

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],  
      lastname: [  '', [Validators.required, Validators.min(4), Validators.max(20)], ],
      firstname: [  '', [Validators.required, Validators.min(4), Validators.max(20)], ],
      dateOfBirth:  ['',[Validators.required],],
      password: ['', this.getPasswordValidators()]
    });
  }
  ngOnInit(): void {
      this.userId = this.route.snapshot.paramMap.get('id') || null;
      if (this.userId) {
        this.isEditMode = true; 
        this.updatePasswordValidators();
        this.getUserById(+this.userId)
      }
  }
  public getUserById(userId: number) {
    this.authService.getUser(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.formGroup.patchValue({
          email: user.email,
          lastname: user.lastname,
          firstname: user.firstname,
          dateOfBirth: user.dateOfBirth,
        });
      },
      error: (error) => {
        this.errorMessage = error.error.message;
      }
    });
  }
  private getPasswordValidators(): ValidatorFn[] {
    return this.isEditMode ? [] : [Validators.required, Validators.minLength(8)];
  }
  public updatePasswordValidators(): void {
    const passwordControl = this.formGroup.get('password');
    if (passwordControl) {
      passwordControl.clearValidators();
      if (!this.isEditMode) {
        passwordControl.setValidators([Validators.required, Validators.minLength(8)]);
      }
      passwordControl.updateValueAndValidity();
    }
  }

  public AddUser(): void {
    if (this.formGroup.valid) {
      this.isLoading = true; 
      const registerUser = this.formGroup.value as RegisterUserRequest
      this.authService.registerUser(registerUser).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.isLoading = false; 
          this.messageResponse = response.message;
          const snackBarRef = this.snackBar.open(this.messageResponse, 'Fermer', {
            duration: 3000,
          });
          snackBarRef.afterDismissed().subscribe(() => {
            this.formGroup.reset();
            this.router.navigate(['/admin/users']);
          });
        },
        error: (error) => {
          this.isLoading = false; 
          this.errorMessage = error.error.message;
        }
      });
    }
  }
  public updateUser(): void {
    if (this.formGroup.valid) {
      this.isLoading = true; 
      const registerUser = this.formGroup.value as User
      this.adminService.updateUser(+this.userId!, registerUser).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.isLoading = false; 
          this.messageResponse = response.message;
          const snackBarRef = this.snackBar.open(this.messageResponse, 'Fermer', {
            duration: 3000,
          });
          snackBarRef.afterDismissed().subscribe(() => {
            this.formGroup.reset();
            this.router.navigate(['/admin/users']);
          });
        },
        error: (error) => {
          this.isLoading = false; 
          this.errorMessage = error.error.message;
        }
      });
    }
  }
  public back() {
    window.history.back();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
