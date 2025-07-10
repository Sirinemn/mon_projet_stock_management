import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/loginRequest';
import { AuthResponse } from '../models/auth-response';
import { RegisterAdminRequest } from '../models/registerRequest';
import { RegisterUserRequest } from '../models/registerUserRequest';
import { User } from '../models/user';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { MessageResponse } from '../../shared/models/messageResponse';
import { ResetPasswordConfirmRequest } from '../models/reset-password-request';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private httpclient: HttpClient, private router: Router) { }

  public login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.httpclient.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest);
  }
  public getUser(id: number): Observable<User> {
    return this.httpclient.get<User>(`${this.apiUrl}/${id}`);
  }

  public registerAdmin(registerRequest: RegisterAdminRequest) : Observable<any> {
    return this.httpclient.post(`${this.apiUrl}/register`, registerRequest);
  }

  public registerUser(registerRequest: RegisterUserRequest) : Observable<any> {
    return this.httpclient.post(`${this.apiUrl}/register/user`, registerRequest);
  }
  public logout() {
    localStorage.removeItem('token');
    this.router.navigate(['auth/login']);
  }
  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  public getAuthenticatedUser(): Observable<User> {
    return this.httpclient.get<User>(`${this.apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
  public changePassword(changePasswordRequest: ChangePasswordRequest): Observable<MessageResponse> {
    return this.httpclient.patch<MessageResponse>(`${this.apiUrl}/users/change-password`, changePasswordRequest);
  }
  public sendResetPasswordEmail(email: string): Observable<MessageResponse> {
    return this.httpclient.post<MessageResponse>(`${this.apiUrl}/reset-password-request`, email);
  }
  public validateResetToken(token: string): Observable<User> {
    return this.httpclient.get<User>(`${this.apiUrl}/validate-token`, {
      params: { token }
    });
  }
  public resetPassword(resetRequest: ResetPasswordConfirmRequest): Observable<MessageResponse> {
    return this.httpclient.post<MessageResponse>(`${this.apiUrl}/reset-password`, resetRequest);
  }
}
