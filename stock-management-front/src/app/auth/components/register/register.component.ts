import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterAdminRequest } from '../../models/registerRequest';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-register',
  providers: [provideNativeDateAdapter()],
  imports: [MatProgressSpinnerModule, MatIconModule ,MatCardModule, MatDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnDestroy {
  public formGroup: FormGroup;
  public errorMessage: string = '';
  public subscription: Subscription = new Subscription();
  public messageResponse: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
      this.formGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],  
        lastname: [  '', [Validators.required, Validators.min(4), Validators.max(20)], ],
        firstname: [  '', [Validators.required, Validators.min(4), Validators.max(20)], ],
        groupName: [  '', [Validators.required, Validators.min(4), Validators.max(20)], ],
        dateOfBirth:  ['',[Validators.required],],
        password: [ '', [Validators.required],]
      });
  }
  public Submit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.formGroup.value;
      formValue.firstname = formValue.firstname.trim();
      formValue.lastname = formValue.lastname.trim();
      formValue.groupName = formValue.groupName.trim();
      formValue.email = formValue.email.trim();

      const registerRequest = this.formGroup.value as RegisterAdminRequest;
      
      this.subscription = this.authService.registerAdmin(registerRequest).subscribe({
        next: (response) => {
          this.isLoading = false; 
          this.messageResponse = response.message;
          const snackBarRef = this.snackBar.open(this.messageResponse, 'Fermer', {
            duration: 3000,
          });
          snackBarRef.afterDismissed().subscribe(() => {
            this.formGroup.reset();
            this.router.navigate(['auth/login']);
          });
        },
        error: (err) => {
          this.isLoading = false; 
          console.error('Registration failed:', err);
          this.errorMessage = err.error.message;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  public back() {
    window.history.back();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
