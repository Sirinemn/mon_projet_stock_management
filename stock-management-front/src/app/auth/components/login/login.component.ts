import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/loginRequest';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { AuthResponse } from '../../models/auth-response';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [MatProgressSpinnerModule, MatIconModule , MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy{
  public subscribtion: Subscription = new Subscription();
  public isLoading: boolean = false;
  public errorMessage: string = '';

  public formGroup:FormGroup ;
  constructor(private formbuilder: FormBuilder,
    private authService: AuthService,
    private sessionService: SessionService,
    private authStateService: AuthStateService,
    private router: Router
  ) {
    this.formGroup = this.formbuilder.group({
      email: [ '', Validators.required],
      password: [ '', Validators.required]
    });
  }

  public Submit() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      const loginRequest = this.formGroup.value as LoginRequest
      this.subscribtion = this.authService.login(loginRequest).subscribe({
        next: (authResponse: AuthResponse) => {
          this.authService.getUser(authResponse.userId).subscribe({
            next: (user) => {
              this.sessionService.logIn(user);
              this.authStateService.userRole = user.roles;
              this.authStateService.setFirstLogin(user.firstLogin? true : false);
              this.authStateService.setIsAdmin(user.roles.includes('ADMIN'));
              this.authStateService.setIsMonitoring(user.roles.includes('MONITORING'));
              localStorage.setItem('token', authResponse.token);
              this.isLoading = false;
              if(user.roles.includes('MONITORING')) {
                this.router.navigate(['monitoring/health']);
              } else{
                this.router.navigate(['features/dashboard/view']);
              }
              
            },
            error: (err) => {
              this.isLoading = false;
              console.error('Error fetching user data:', err);
              this.errorMessage = err.error.message || 'Erreur lors de la récupération des données utilisateur.';
            }
          })
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Login failed:', err);
          this.errorMessage = err.error.message;
        }
      });
    }
  }
  public goToRegister() {
    this.router.navigate(['auth/register']);
  }
  public back() {
    window.history.back();
  }
  public ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }

}
