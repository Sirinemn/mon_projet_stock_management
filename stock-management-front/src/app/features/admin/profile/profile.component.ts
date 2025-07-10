import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../auth/models/user';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../../core/services/session.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../mat-dialog/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  providers: [provideNativeDateAdapter()],
  imports: [MatIconModule, MatCardModule, ReactiveFormsModule, MatFormField, MatLabel, RouterLink, MatDatepickerModule, MatFormFieldModule, MatInputModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user!: User | null;
  public userId: number = 0;
  public errorMessage: string = '';
  public destroy$ = new Subject<void>();
  public isLoading: boolean = false;
  public profileForm!: FormGroup;

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
  ) {
    this.profileForm = this.formBuilder.group({
      lastname: ['', [Validators.required, Validators.min(4), Validators.max(20)]],
      firstname: ['', [Validators.required, Validators.min(4), Validators.max(20)]],
      groupName: ['', [Validators.required, Validators.min(4), Validators.max(20)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getUser();
  }

  public getUser() {
    this.isLoading = true;
    this.sessionService.getUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.userId = user?.id || 0;

          const birthDate = user?.dateOfBirth ? new Date(user.dateOfBirth) : null;
          this.profileForm.patchValue({
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            dateOfBirth: birthDate,
            groupName: user?.groupName,
          });
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Une erreur est survenue';
          this.isLoading = false;
        }
      });
  }

  public onSubmit() {
    if (this.profileForm.valid && this.userId) {
      const updatedUser = {
        firstname: this.profileForm.value.firstname,
        lastname: this.profileForm.value.lastname,
        email: this.profileForm.value.email,
        dateOfBirth: this.profileForm.value.dateOfBirth
      } as User;

      this.adminService.updateUser(this.userId, updatedUser).subscribe({
        next: () => {
          this.snackBar.open('Profil mis à jour avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });

          // Récupérer les données utilisateur mises à jour du serveur
          this.authService.getUser(this.userId).subscribe({
            next: (updatedUserFromServer) => {
              // Mettre à jour la session avec les nouvelles données
              this.sessionService.updateUser(updatedUserFromServer);
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des données utilisateur:', err);
            }
          });

          // Mise à jour du groupe séparément
          if (this.user?.groupName !== this.profileForm.value.groupName) {
            this.adminService.updateGroupName(this.userId, this.profileForm.value.groupName).subscribe({
              next: () => {
                this.snackBar.open('Nom mis à jour avec succès', 'Fermer', {
                  duration: 3000,
                  panelClass: ['success-snackbar'],
                });

                // Récupérer à nouveau les données après la mise à jour du groupe
                this.authService.getUser(this.userId).subscribe({
                  next: (updatedUserFromServer) => {
                    this.sessionService.updateUser(updatedUserFromServer);
                  },
                  error: (err) => {
                    console.error('Erreur lors de la récupération des données utilisateur:', err);
                  }
                });
              },
              error: () => {
                this.snackBar.open('Erreur lors de la mise à jour du Nom ', 'Fermer', {
                  duration: 3000,
                  panelClass: ['error-snackbar'],
                });
              }
            });
          }
        },
        error: () => {
          this.snackBar.open('Erreur lors de la mise à jour du profil', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
      });
    } else {
      this.snackBar.open('Veuillez corriger les erreurs dans le formulaire', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  public deleteAccount() {
    this.isLoading = true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Suppression définitive',
        message: 'Voulez-vous vraiment supprimer votre compte administrateur ?',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.isLoading = false;
      if (result) {
        this.adminService.deleteUser(this.userId).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.sessionService.logOut();
            this.authService.logout();
            this.router.navigate(['']);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
            this.snackBar.open(this.errorMessage, 'Fermer', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  public back() {
    window.history.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}