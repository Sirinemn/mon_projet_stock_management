import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Category } from '../../models/category';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { SessionService } from '../../../../core/services/session.service';
import { User } from '../../../../auth/models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../mat-dialog/confirm-dialog/confirm-dialog.component';
import { CategorieService } from '../../../inventory/products/services/categorie.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-category-list',
  imports: [MatIconModule, MatTableModule, MatButtonModule, CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit, OnDestroy {
  public categories: Category[] = [];
  public newCategoryName: string = '';
  public user: User | null = null;
  public userId: number = 0;
  public groupId: number = 0;
  public isAddingCategory: boolean = false;
  public errorMessage: string = '';
  public loading: boolean = false;
  public destroy$ = new Subject<void>();
  public displayedColumns: string[] = ['index', 'name', 'actions'];

  constructor(
    private adminService: AdminService,
    private sessionService: SessionService,
    private dialog: MatDialog,
    private categoryService: CategorieService,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.sessionService.getUser$().pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.user = user ?? null;
        this.userId = this.user ? this.user.id : 0;
        this.groupId = this.user?.groupId ?? 0;
        if (this.groupId) {
          this.getCategories(this.groupId);
        } else {
          this.errorMessage = "Utilisateur non authentifié.";
        }
      },
      error: () => {
        this.errorMessage = "Erreur lors de la récupération de l'utilisateur.";
      }
    });
  }
  public toggleAddCategory() {
    this.isAddingCategory = !this.isAddingCategory;
  }
  public cancelAddCategory() {
    this.isAddingCategory = false;
    this.newCategoryName = '';
  }
  public addCategory() {
    if (this.newCategoryName.trim() === '') return;
    this.loading = true;
    this.adminService.addCategory(this.newCategoryName, this.userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.getCategories(this.groupId);
        this.isAddingCategory = false;
        this.newCategoryName = '';
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error.message || 'An error occurred while adding the category.';       
      }
    });
  }  
  private getCategories(groupId: number): void {
    if (!this.groupId) {
      this.errorMessage = "GroupId invalid.";
      return;
    }
    this.loading = true;
    this.categoryService.getCategories(this.groupId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error.message || "Erreur lors du chargement des catégories.";
      },
    });
  }

  public deleteCategory(category: Category) {
    this.loading = true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      data: {
        title: 'Suppression de la catégorie',
        message: 'Êtes-vous sûr de vouloir supprimer cette categorie ?',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.adminService.deleteCategory(category.id, this.groupId).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.getCategories(this.groupId);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = error.error.message || 'Erreur lors de la suppression de la catégorie.';
            this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000 });
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
