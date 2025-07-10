import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../../auth/models/user';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../../../core/services/session.service';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../mat-dialog/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-users-list',
  imports: [MatIconModule, MatTableModule, MatButtonModule, RouterLink, CommonModule, MatProgressSpinnerModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit, OnDestroy {

  users = new MatTableDataSource<User>();
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'actions'];
  public loading: boolean = false;
  private destroy$ = new Subject<void>();
  private userId: number = 0;
  public errorMessage: string = '';

  constructor(
    private adminService: AdminService,
    private router:Router,
    private session:SessionService,
    private matdialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.userId = this.session.user?.id || 0;
    this.getUsers();
  }
  public getUsers(): void {
    this.loading = true;
    this.adminService.getUsers(this.userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (users: User[]) => {
        this.users.data = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  public back() {
    window.history.back();
  }
  deleteUser(userId: number) {
    const dialogRef = this.matdialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Suppression de l\'utilisateur',
        message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
      }
  });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.adminService.deleteUser(userId).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.getUsers();
          },
          error: (error) => {
            this.getUsers();
            this.loading = false;
            this.errorMessage = error.error.message || 'Une erreur est survenue lors de la suppression de l\'utilisateur.';
            this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000 });
          }
        });
      }
    })
  }
  editUser(userId: number) {
    this.router.navigate([`/admin/user/edit/${userId}`]);
  }
  viewUser(userId: number) {
    this.router.navigate([`/admin/user/view/${userId}`]);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
