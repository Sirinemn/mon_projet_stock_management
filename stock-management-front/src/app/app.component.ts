import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { AuthService } from './auth/services/auth.service';
import { SessionService } from './core/services/session.service';
import { User } from './auth/models/user';
import { HeaderComponent } from "./shared/components/header/header.component";
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PasswordChangeDialogComponent } from './mat-dialog/password-change-dialog/password-change-dialog.component';
import { AuthStateService } from './core/services/auth-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, CommonModule, MatToolbarModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'stock-management-front';
  public destroy$ = new Subject<void>();
  public isLogged$: Observable<boolean> = of(false);
  public user?: User;
  public firstLogin: boolean = false;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private authStateService: AuthStateService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setupAutoLogin();
    this.setupFirstLoginCheck();
  }
  public $isLogged(): Observable<boolean> {
    return this.sessionService.isLogged$();
  }
  public setupFirstLoginCheck(): void {
    this.sessionService.isLogged$()
      .pipe(
        filter(isLogged => isLogged),
        switchMap(() => this.authStateService.getIsAdmin()),
        filter(isAdmin => !isAdmin),
        switchMap(() => this.authStateService.getFirstLogin()),
        takeUntil(this.destroy$)
      )
      .subscribe(firstLogin => {
        if (this.shouldOpenDialog(firstLogin)) {
          this.openPasswordChangeDialog();
        }
      });
  }
  public setupAutoLogin(): void {
    this.authService.getAuthenticatedUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: user => this.handleSuccessfulLogin(user),
        error: err => this.handleFailedLogin(err)
      });
  }
  private handleSuccessfulLogin(user: User): void {
    this.sessionService.logIn(user);
    this.user = user;
    this.authStateService.setFirstLogin(user.firstLogin? true : false);
    this.authStateService.setIsAdmin(user.roles.includes('ADMIN'))
    
    if (this.shouldOpenDialog(this.user?.firstLogin?? false)) {
      this.openPasswordChangeDialog();
    }

    this.redirectToDashboard();
  }
  private handleFailedLogin(err: any): void {
    if (err.status === 401) {
      console.log('Utilisateur non authentifié, déconnexion automatique.');
      this.sessionService.logOut();
    } else {
      console.error('Erreur lors de la récupération des informations utilisateur :', err);
    }
  }
  private shouldOpenDialog(firstLogin: boolean): boolean {
    return firstLogin && 
           !this.router.url.includes('/user/change-password');
  }
  private redirectToDashboard(): void {
    if (!this.router.url.includes('/features/dashboard/view')) {
      this.router.navigate(['/features/dashboard/view']);
    }
  }
  private openPasswordChangeDialog(): void {
    if (this.dialog.openDialogs.length > 0) return;
    
    const dialogRef = this.dialog.open(PasswordChangeDialogComponent, {
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'redirect') {
        this.router.navigate(['user/change-password']);
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}